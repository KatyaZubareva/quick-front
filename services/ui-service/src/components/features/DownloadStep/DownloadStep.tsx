import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiCheck, FiCopy, FiDownload, FiLogOut, FiPackage } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { Button } from "../../core/Button/Button";
import StepHeader from "../../core/StepHeader/StepHeader";

interface DownloadStepProps {
  selectedFramework?: string | null;
  selectedVersion?: string | null;
  selectedFeatures?: string[];
  selectedTemplate?: string | null;
  templateName?: string | null;
  projectName: string;
  projectDescription?: string;
  onBack?: () => void;
}

const SummaryItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
    <p className="text-xs text-zinc-500">{label}</p>
    <p className={`mt-0.5 truncate text-sm font-medium ${value ? "text-zinc-100" : "text-zinc-600"}`}>{value || "Не выбрано"}</p>
  </div>
);

const DownloadStep: React.FC<DownloadStepProps> = ({
  selectedFramework,
  selectedVersion,
  selectedFeatures,
  selectedTemplate,
  templateName,
  projectName,
  projectDescription,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL || "http://localhost:3002";
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const navigate = useNavigate();

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPushingToGitHub, setIsPushingToGitHub] = useState(false);
  const [gitHubStatus, setGitHubStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (token) {
      verifyGitHubToken(token);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      setError(`GitHub authentication failed: ${errorParam}`);
      navigate(window.location.pathname, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!selectedFramework) {
      setError("Сначала выберите фреймворк");
      return;
    }

    try {
      const config = {
        projectName: projectName || "my-project",
        projectDescription: projectDescription || "",
        framework: selectedFramework,
        version: selectedVersion || "",
        features: selectedFeatures || [],
        template: selectedTemplate || ""
      };

      const bytes = new TextEncoder().encode(JSON.stringify(config));
      const encodedParams = btoa(String.fromCharCode(...bytes));
      setDownloadLink(`${API_URL}/download?params=${encodeURIComponent(encodedParams)}`);
      setError(null);
    } catch (err) {
      setError("Не удалось создать ссылку для скачивания");
      console.error("Ошибка кодировки:", err);
    }
  }, [selectedFramework, selectedVersion, selectedFeatures, selectedTemplate, projectName, projectDescription, API_URL]);

  const verifyGitHubToken = async (token: string) => {
    try {
      const octokit = new Octokit({ auth: token });
      const { data } = await octokit.rest.users.getAuthenticated();
      setIsAuthenticated(true);
      setGitHubUsername(data.login);
      return true;
    } catch (_error) {
      localStorage.removeItem("github_token");
      setIsAuthenticated(false);
      return false;
    }
  };

  const handleGitHubLogin = () => {
    localStorage.removeItem("github_token");
    setIsAuthenticated(false);
    
    const redirectUri = encodeURIComponent(`${window.location.origin}/github-callback`);
    const scope = encodeURIComponent("repo");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const downloadZip = async () => {
    if (!downloadLink) {
      setError("Ссылка для скачивания не готова");
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(downloadLink);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Сервер ответил ${response.status}: ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Получен пустой файл");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName || "project"}.zip`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (_err) {
      console.error("Загрузка не удалась:", _err);
      setError(_err instanceof Error ? _err.message : "Не удалось загрузить проект");
    } finally {
      setIsDownloading(false);
    }
  };

  const pushToGitHub = async () => {
    if (!projectName.trim()) {
      setError("Пожалуйста введите название проекта");
      return;
    }

    setIsPushingToGitHub(true);
    setError(null);
    setGitHubStatus("Создание репозитория...");

    try {
      const token = localStorage.getItem("github_token");
      if (!token || !(await verifyGitHubToken(token))) {
        throw new Error("Сначала выполните аутентификацию на GitHub");
      }

      setGitHubStatus("Генерация проекта...");
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          projectDescription,
          framework: selectedFramework,
          version: selectedVersion,
          features: selectedFeatures,
          template: selectedTemplate,
        }),
      });

      if (!response.ok) throw new Error("Генерация проекта не удалась");
      const projectData = await response.json();

      setGitHubStatus("Загрузка в GitHub...");
      const uploadResponse = await fetch(`${GITHUB_API_URL}/api/repos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName,
          projectDescription,
          files: projectData.files
        }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Загрузка GitHub не удалась");
      }

      const { repoUrl } = await uploadResponse.json();
      setGitHubStatus("Готово! Перенаправляем на GitHub...");
      setTimeout(() => {
        window.open(repoUrl, "_blank");
      }, 1500);
    } catch (_err) {
      console.error("Ошибка отправки на GitHub:", _err);
      setGitHubStatus("Ошибка");
      setError(_err instanceof Error ? _err.message : "Не удалось отправить на GitHub");
    } finally {
      setIsPushingToGitHub(false);
    }
  };

  const copyToClipboard = async () => {
    if (!downloadLink) return;
    try {
      await navigator.clipboard.writeText(downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_err) {
      setError("Не удалось скопировать ссылку");
    }
  };

  const signOutGitHub = () => {
    localStorage.removeItem("github_token");
    setIsAuthenticated(false);
    setGitHubUsername("");
  };

  return (
    <div>
      <StepHeader
        eyebrow="Шаг 6"
        title="Проект готов"
        description="Проверьте конфигурацию и заберите проект в удобном формате."
      />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <SummaryItem label="Название" value={projectName.trim() || "my-project"} />
        <SummaryItem
          label="Фреймворк"
          value={selectedFramework ? `${selectedFramework}${selectedVersion ? ` ${selectedVersion}` : ""}` : null}
        />
        <SummaryItem label="Шаблон" value={templateName ?? selectedTemplate} />
      </div>

      {!!selectedFeatures?.length && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedFeatures.map((feature) => (
            <span key={feature} className="chip">
              {feature}
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {gitHubStatus && !error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
          {gitHubStatus}
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-lg text-brand-300">
            <FiPackage />
          </span>
          <h3 className="font-medium text-white">Скачать архив</h3>
          <p className="mb-5 mt-1 flex-1 text-[13px] text-zinc-400">ZIP со всеми файлами — распакуйте и запустите npm install.</p>
          <Button
            fullWidth
            icon={<FiDownload />}
            loading={isDownloading}
            disabled={!downloadLink}
            onClick={downloadZip}
          >
            {isDownloading ? "Генерация..." : "Скачать ZIP"}
          </Button>
        </div>

        <div className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] text-lg text-white">
            <SiGithub />
          </span>
          <h3 className="font-medium text-white">Отправить на GitHub</h3>
          <p className="mb-5 mt-1 flex-1 text-[13px] text-zinc-400">
            {isAuthenticated ? (
              <>
                Подключено как <span className="text-zinc-200">@{gitHubUsername}</span>
              </>
            ) : (
              "Создадим репозиторий и загрузим в него код проекта."
            )}
          </p>
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                fullWidth
                icon={<SiGithub />}
                loading={isPushingToGitHub}
                disabled={!projectName}
                onClick={pushToGitHub}
              >
                {isPushingToGitHub ? "Загрузка..." : "Создать репозиторий"}
              </Button>
              <Button variant="outline" onClick={signOutGitHub} aria-label="Выйти из GitHub" title="Выйти из GitHub">
                <FiLogOut />
              </Button>
            </div>
          ) : (
            <Button variant="secondary" fullWidth icon={<SiGithub />} onClick={handleGitHubLogin}>
              Войти через GitHub
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-zinc-500">Прямая ссылка на архив</label>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 p-1.5 pl-4">
          <input
            type="text"
            value={downloadLink}
            readOnly
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs text-zinc-400 focus:outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            icon={copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
          >
            {copied ? "Скопировано" : "Копировать"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadStep;
