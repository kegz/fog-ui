import React from "react";
import { IconButton } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export interface UserGroupCardProps {
  _id: string;
  name: string;
  description: string;
  permissionsList: string[];
  allowDelete?: boolean;
  allowUpdate?: boolean;
}

export const UserGroupCard: React.FC<UserGroupCardProps> = ({ _id, name, description, permissionsList, allowUpdate, allowDelete }) => {
  const [expanded, setExpanded] = React.useState(false);
  console.log('id from UserGroupCard ', _id);

  const Delete: React.ReactNode = (
    <IconButton
      aria-label={`Delete ${name}`}
      color="error"
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid={`user-group-delete-${_id}`}
    >
      <DeleteIcon />
    </IconButton>
  );

  const Update: React.ReactNode = (
    <IconButton
      aria-label={`Edit ${name}`}
      color="primary"
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-testid={`user-group-update-${_id}`}
    >
      <EditIcon />
    </IconButton>
  );

  return (
    <Accordion
      key={_id}
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      data-testid={`user-group-card-${_id}`}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`user-group-panel-${_id}-content`}
        id={`user-group-panel-${_id}-header`}
        data-testid={`user-group-card-summary-${_id}`}
        aria-expanded={expanded}
      >
        {name.replace("_", " ")} {allowDelete && Delete} {allowUpdate && Update}
      </AccordionSummary>
      <AccordionDetails
        data-testid={`user-group-card-details-${_id}`}
        id={`user-group-panel-${_id}-content`}
      >
        {description}<br /><br />
        List of Permissions: <br />
        {permissionsList.length > 0 ? (
          permissionsList.map((permission) => (permission + ', '))
        ) : (<p>No Permissions Assigned.</p>)}
      </AccordionDetails>
    </Accordion>
  );
};

