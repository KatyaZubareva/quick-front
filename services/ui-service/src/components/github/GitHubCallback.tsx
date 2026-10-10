import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import Spinner from "../core/Spinner/Spinner";

interface ProjectFile {
  path: string;
  content: string;
}

const GitHubCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<string>("Аутентификация с GitHub...");
  const [error, setError] = useState<string | null>(null);

  const getProjectData = (): { name: string; files: ProjectFile[] } => {
    const stateData = location.state?.projectData;
    if (stateData) return stateData;

    const storedData = localStorage.getItem("project_data");
    if (storedData) return JSON.parse(storedData);

    throw new Error("Данные проекта не найдены");
  };

  const uploadProjectToGitHub = async (token: string) => {
    try {
      const { name: projectName, files } = getProjectData();
      setStatus("Подготовка файлов проекта...");

      setStatus("Создание репозитория на GitHub...");
      const repoResponse = await fetch("http://localhost:3002/api/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: projectName || `quickfront-project-${Date.now()}`,
          projectDescription: "Проект создан с помощью QuickFront",
          files,
        }),
      });

      if (!repoResponse.ok) {
        const errorData = await repoResponse.json();
        throw new Error(errorData.message || "Ошибка при создании репозитория");
      }

      const { repoUrl } = await repoResponse.json();
      return repoUrl;
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      throw err;
    }
  };

  useEffect(() => {
    const handleGitHubCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          throw new Error(`Ошибка авторизации GitHub: ${error}`);
        }

        if (!code) {
          throw new Error("Код авторизации не получен");
        }

        setStatus("Обмен кода на токен...");
        
        const tokenResponse = await fetch("http://localhost:3002/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.message || "Ошибка аутентификации с GitHub");
        }

        const { token } = await tokenResponse.json();
        localStorage.setItem("github_token", token);

        setStatus("Загрузка проекта на GitHub...");
        const repoUrl = await uploadProjectToGitHub(token);

        navigate("/download", {
          state: {
            success: true,
            repoUrl,
            message: "Проект успешно загружен на GitHub!",
          },
          replace: true,
        });

      } catch (err) {
        console.error("Ошибка GitHub callback:", err);
        setError(err instanceof Error ? err.message : "Ошибка аутентификации GitHub");
        
        navigate("/download", {
          state: {
            error: err instanceof Error ? err.message : "Ошибка аутентификации GitHub",
          },
          replace: true,
        });
      }
    };

    handleGitHubCallback();
  }, [navigate, location]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/15 blur-[120px]" />
      <div className="surface relative w-full max-w-sm p-8 text-center">
        {!error ? (
          <>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] text-brand-300">
              <Spinner className="h-6 w-6" />
            </div>
            <p className="font-medium text-white">{status}</p>
            {status.includes("Загрузка") && (
              <p className="mt-2 text-sm text-zinc-400">Это может занять некоторое время...</p>
            )}
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-xl text-red-400">
              <FiAlertTriangle />
            </div>
            <p className="font-medium text-white">{error}</p>
            <p className="mt-2 text-sm text-zinc-400">Перенаправление...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubCallback;
