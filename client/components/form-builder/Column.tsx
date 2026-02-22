type ColumnProps = {
  id: string;
  children: React.ReactNode;
};
function Column({ id, children }: ColumnProps) {
  return (
    <div className="w-full p-2 border flex items-center gap-2">
      <span>{id}</span>
      {children}
    </div>
  );
}

export default Column;
