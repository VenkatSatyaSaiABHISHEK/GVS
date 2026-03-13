import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";

const Experience = ({ experience, onDelete, onUpdate, onAdd }) => {
  return (
    <div className="">
      {experience.length > 0 ? (
        experience?.map((exp) => (
          <div
            key={exp.id}
            className="mb-2 bg-muted shadow-sm border hover:bg-muted/50 py-4"
          >
            <div className="grid grid-cols-2">
              <div className="float-left px-4">
                <h3 className="font-bold">{exp?.jobTitle}</h3>
                <p>{exp?.employer}</p>
                <p>Start Date: {exp?.startDate}</p>
                <p>End Date: {exp?.endDate}</p>
                <p
                  className="bullet_list"
                  dangerouslySetInnerHTML={{ __html: exp?.description }}
                />
              </div>
              <div className="px-6 w-full flex items-center justify-end h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdate(exp)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(exp?.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mb-2 bg-muted shadow-sm border hover:bg-muted/50 py-4">
          Add Experience to show here
        </div>
      )}
      <Button onClick={onAdd}>
        <Plus />
        <span>Add Experience</span>
      </Button>
    </div>
  );
};

Experience.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      jobTitle: PropTypes.string.isRequired,
      employer: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Experience;
