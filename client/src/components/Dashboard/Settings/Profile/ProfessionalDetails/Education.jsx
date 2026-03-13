import { Edit, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

const Education = ({ education, onDelete, onUpdate, onAdd }) => {
  return (
    <div className="">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="mb-2 bg-muted shadow-2xl border hover:bg-muted/50 py-4"
        >
          <div className="grid grid-cols-2">
            <div className="float-left px-4">
              <h3 className="font-bold">{edu?.institution}</h3>
              <p>{edu?.degree}</p>
              <p>Year of Graduation: {edu?.yearOfGraduation}</p>
            </div>
            <div className="px-6 w-full flex items-center justify-end h-full">
              <Button variant="ghost" size="icon" onClick={() => onUpdate(edu)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(edu?.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={onAdd}>
        <Plus />
        <span>Add Education</span>
      </Button>
    </div>
  );
};

Education.propTypes = {
  education: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      institution: PropTypes.string.isRequired,
      degree: PropTypes.string.isRequired,
      yearOfGraduation: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Education;
