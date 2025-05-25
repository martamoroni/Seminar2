import { IoIosArrowDown } from "react-icons/io";

function TableHeader(props) {
  // Function to sort in ascending order based on a key (column selected)
  const sortColumn = (key) => {
    const sortedAssignments = [...props.assignments].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });

    props.setAssignments(sortedAssignments); // update state to show new table
    props.setSortingKey(key); // update sorting state
  };

  return (
    <th onClick={() => sortColumn(props.sortingKey)}>
      {props.headerText}
      <span className="icon-wrapper">
        <IoIosArrowDown
          className={props.sortingKey === props.sortingKeyValue ? "" : "hidden"}
        />
      </span>
    </th>
  );
}

export default TableHeader;
