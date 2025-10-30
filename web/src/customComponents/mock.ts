export function mockUsers(length: number) {
  const createRowData = (rowIndex: number) => {
    return {
      id: rowIndex + 1,
      status: null,
    };
  };

  return Array.from({ length }).map((_, index) => {
    return createRowData(index);
  });
}
