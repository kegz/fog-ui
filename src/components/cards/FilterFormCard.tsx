import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormField } from "../forms/types";
import { GenericForm } from '../forms/Form';

export interface FilterFormCardProps {
  name: string;
  filterFormFields: FormField[];
  onChange: (values: Record<string, any>) => void;
}

export const FilterFormCard: React.FC<FilterFormCardProps> = ({ name, filterFormFields, onChange }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleSubmit = (formData: Record<string, any>) => {
    try {
      onChange(formData);
    } catch (error) {
      console.error("Error handling filter form:", error);
    }
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      data-testid="filter-form-card"
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        data-testid="filter-form-card-summary"
        aria-controls="filter-form-card-content"
        id="filter-form-card-header"
        aria-expanded={expanded}
      >
        {name.replace("_", " ")}
      </AccordionSummary>
      <AccordionDetails
        data-testid="filter-form-card-details"
        id="filter-form-card-content"
      >
        <GenericForm fields={filterFormFields} onSubmit={handleSubmit} submitButtonText={'Search'} />
      </AccordionDetails>
    </Accordion>
  );
};

