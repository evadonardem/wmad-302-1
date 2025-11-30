import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const score = query.get("score");
  const total = query.get("total");

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
      <p className="text-xl mb-6">
        You scored {score} out of {total} 🎉
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Result;
