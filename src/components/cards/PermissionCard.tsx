import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GenericForm } from "../forms/Form";
import { FormField } from "../forms/types";

export interface PermissionCardProps {
  data: {
    _id: string;
    name: string;
    actions: string[];
    __v: number;
  };
}

export const PermissionCard: React.FC<PermissionCardProps> = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleFormSubmit = async (submittedData: any) => {
    // support either an event or form data object
    if (submittedData && typeof submittedData.preventDefault === 'function') {
      submittedData.preventDefault();
      return;
    }
    // if we receive form data, no-op for now
    return;
  };

  const actionFields: FormField[] = data.actions.map((action) => ({
    name: action,
    label: action.charAt(0).toUpperCase() + action.slice(1),
    type: "switch",
    required: false,
  }));

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      data-testid={`permission-card-${data._id}`}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`permission-panel-${data._id}-content`}
        id={`permission-panel-${data._id}-header`}
        data-testid={`permission-card-summary-${data._id}`}
        aria-expanded={expanded}
      >
        {data.name.replace("_", " ")}
      </AccordionSummary>
      <AccordionDetails
        data-testid={`permission-card-details-${data._id}`}
        id={`permission-panel-${data._id}-content`}
      >
        <GenericForm fields={actionFields} onSubmit={handleFormSubmit} />
      </AccordionDetails>
    </Accordion>
  );
};

