import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  addEducation,
  addExperience,
  addProject,
  removeEducation,
  removeExperience,
  removeProject,
  updateEducation,
  updateExperience,
  updateProject,
} from "@/services/userServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Education from "./Education";
import Experience from "./Experience";
import ItemDialog from "./UpdateItemDialog";
import Projects from "./Projects";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ProfessionalDetails = () => {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      const { action, type, id, item } = data;
      switch (action) {
        case "create":
          switch (type) {
            case "projects":
              return addProject(item);
            case "education":
              return addEducation(item);
            case "experience":
              return addExperience(item);
            default:
              break;
          }
          break;
        case "update":
          switch (type) {
            case "projects":
              return updateProject(id, item);
            case "education":
              return updateEducation(id, item);
            case "experience":
              return updateExperience(id, item);
            default:
              break;
          }
          break;
        case "delete":
          switch (type) {
            case "projects":
              return removeProject(id);
            case "education":
              return removeEducation(id);
            case "experience":
              return removeExperience(id);
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    // NOTE: check the what it returns and set it to cache
    onSuccess: (data) => {
      queryClient.invalidateQueries(["currentUser"]);
      toast.success("Success!", {
        description: data.message,
      });
      /* queryClient.setQueryData(["currentUser"], (old) => {
        return { ...old, ...data };s
      }); */
      setIsDialogOpen(false);
      console.log(
        "Fix data handling here setquerydat current use in profesionalDetails"
      );
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleAction = (action, type, id = null, item = null) => {
    mutation.mutate({ action, type, id, item });
  };

  const openDialog = (type, item = null) => {
    setActiveSection(type);
    setItemToEdit(item);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="bg-muted">Loading...</div>;
  }

  return (
    <div className="w-full mx-auto">
      <Accordion
        type="single"
        collapsible
        className="p-1 lg:px-12 rounded-t-xl space-y-2"
      >
        <AccordionItem value="projects">
          <AccordionTrigger className="px-4 rounded-t-2xl bg-muted border">
            Projects
          </AccordionTrigger>
          <AccordionContent className="mt-2 gap-3 overflow grid-flow-dense bg-background">
            <Projects
              projects={user.projects}
              onDelete={(id) => handleAction("delete", "projects", id)}
              onUpdate={(item) => openDialog("projects", item)}
              onAdd={() => openDialog("projects")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className="px-4 bg-muted border">
            Education
          </AccordionTrigger>
          <AccordionContent>
            <Education
              education={user.education}
              onDelete={(id) => handleAction("delete", "education", id)}
              onUpdate={(item) => openDialog("education", item)}
              onAdd={() => openDialog("education")}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className="px-4 rounded--2xl bg-muted border">
            Experience
          </AccordionTrigger>
          <AccordionContent>
            <Experience
              experience={user.experience}
              onDelete={(id) => handleAction("delete", "experience", id)}
              onUpdate={(item) => openDialog("experience", item)}
              onAdd={() => openDialog("experience")}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ItemDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        activeSection={activeSection}
        item={itemToEdit}
        onSubmit={(item) =>
          handleAction(
            itemToEdit ? "update" : "create",
            activeSection,
            itemToEdit?.id,
            item
          )
        }
      />
    </div>
  );
};

export default ProfessionalDetails;
