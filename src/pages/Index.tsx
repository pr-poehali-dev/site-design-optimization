import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Перенаправляем на статический HTML файл
    window.location.href = "/index.html";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">
          Загружаем ваш оптимизированный сайт...
        </p>
      </div>
    </div>
  );
};

export default Index;
