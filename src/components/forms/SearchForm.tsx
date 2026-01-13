import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GenericForm } from "./Form";
import { FormField } from "./types";

type SearchFormProps = {
  title: string;
  data: FormField[];
  handleFormSubmit: (formData: Record<string, any>) => void;
};

export const SearchForm: React.FC<SearchFormProps> = ({ title, data, handleFormSubmit }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Container data-testid="search-form-container">
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
        data-testid="search-form-accordion"
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          data-testid="search-form-accordion-summary"
          aria-controls="search-form-content"
          id="search-form-header"
          aria-expanded={expanded}
        >
          <Typography variant="h5">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          id="search-form-content"
          data-testid="search-form-accordion-details"
        >
          <GenericForm
            fields={data}
            onSubmit={handleFormSubmit}
          />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

