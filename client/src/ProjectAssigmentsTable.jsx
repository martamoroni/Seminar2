import { useEffect, useState } from "react";
import "./ProjectAssigmentsTable.css";
import { IoIosArrowDown } from "react-icons/io";

function ProjectAssigmentsTable() {
  const [assignments, setAssignments] = useState([]);
  const [sortingKey, setSortingKey] = useState("start_date"); // Initially sorts on date. Values are: "employee_id" / "employee_name" / "project_name" / "start_date"

  useEffect(() => {
    // Initial fetching
    fetchAssignments();

    // Auto refresh every minute
    const interval = setInterval(fetchAssignments, 60000);
    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/project_assignments"
      );
      const data = await response.json();
      // Return only the latest 5 (sorting already happens in API)
      setAssignments(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching project assignments:", error);
    }
  };

  // Function to sort in ascending order based on a key (column selected)
  const sortColumn = (key) => {
    const sortedAssignments = [...assignments].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });

    setAssignments(sortedAssignments); // update state to show new table
    setSortingKey(key); // update sorting state
  };

  return (
    <div>
      <h1>The Latest Project Assignments</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortColumn("employee_id")}>
              Employee ID
              <span className="icon-wrapper">
                <IoIosArrowDown
                  className={sortingKey === "employee_id" ? "" : "hidden"}
                />
              </span>
            </th>
            <th onClick={() => sortColumn("employee_name")}>
              Employee Name
              <span className="icon-wrapper">
                <IoIosArrowDown
                  className={sortingKey === "employee_name" ? "" : "hidden"}
                />
              </span>
            </th>
            <th onClick={() => sortColumn("project_name")}>
              Project Name
              <span className="icon-wrapper">
                <IoIosArrowDown
                  className={sortingKey === "project_name" ? "" : "hidden"}
                />
              </span>
            </th>
            <th onClick={() => sortColumn("start_date")}>
              Start Date
              <span className="icon-wrapper">
                <IoIosArrowDown
                  className={sortingKey === "start_date" ? "" : "hidden"}
                />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{assignment.employee_id}</td>
              <td>{assignment.employee_name}</td>
              <td>{assignment.project_name}</td>
              <td>
                {new Date(assignment.start_date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectAssigmentsTable;
