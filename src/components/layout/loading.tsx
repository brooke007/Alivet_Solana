import ReactLoading from "react-loading";
const Loading = () => {
  return (
    // 遮罩层
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
      {/* 加载提示 */}
      <ReactLoading type="balls" color="#D8B4FE" height={"15%"} width={"15%"} />
    </div>
  );
};

export default Loading;
