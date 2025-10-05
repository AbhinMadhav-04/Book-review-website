import React from "react";

const AddBookCard = ({ onAdd }) => {
  return (
    <div
      className="flex flex-col items-center justify-center aspect-[3/5] min-h-[270px] max-h-[340px] rounded-lg border-2 border-dashed border-primary bg-white dark:bg-slate-900 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors shadow-sm"
      onClick={onAdd}
    >
      <span className="text-5xl text-primary mb-2">+</span>
      <span className="text-lg font-semibold text-primary">Add Book</span>
    </div>
  );
};

export default AddBookCard;
