import { useEffect, useState } from "react";
import "./ProjectAssigmentsTable.css";
import TableHeader from "./TableHeader";
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

  return (
    <div>
      <h1>The Latest Project Assignments</h1>
      <table>
        <thead>
          <tr>
            <TableHeader
              sortingKey={sortingKey}
              sortingKeyValue="employee_id"
              headerText="Employee ID"
              assignments={assignments}
              setAssignments={setAssignments}
              setSortingKey={setSortingKey}
            />
            <TableHeader
              sortingKey="employee_name"
              headerText="Emplyee Name"
              assignments={assignments}
              setAssignments={setAssignments}
              setSortingKey={setSortingKey}
            />
            <TableHeader
              sortingKey="project_name"
              headerText="Project Name"
              assignments={assignments}
              setAssignments={setAssignments}
              setSortingKey={setSortingKey}
            />
            <TableHeader
              sortingKey="start_date"
              headerText="Start Date"
              assignments={assignments}
              setAssignments={setAssignments}
              setSortingKey={setSortingKey}
            />
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
