import { Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import moment from "moment";

const Projects = ({ projects, onDelete, onUpdate, onAdd }) => {
  return (
    <div className="flex flex-col justify-center">
      {projects?.map((project) => (
        <div
          key={project.id}
          className="mb-2 bg-muted shadow-2xl border hover:bg-muted/50 py-4"
        >
          <div className="grid grid-cols-2">
            <div className="float-left px-4">
              <h3 className="font-bold inline text-lg">{project?.title}, </h3>{" "}
              <p className="italic inline">{project?.skills?.join(", ")}</p>
              <p>
                <span className="text-gray-600">
                  {project?.endDate
                    ? moment(project?.endDate).format("MMMM-YYYY")
                    : "N/A"}
                </span>
              </p>
            </div>
            <div className="px-6 w-full flex items-center justify-end h-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUpdate(project)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div></div>
        </div>
      ))}
      <Button onClick={onAdd}>
        <Plus />
        <span>Add Project</span>
      </Button>
    </div>
  );
};

Projects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      endDate: PropTypes.string,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Projects;
