import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface AccordionItem {
    id: any;
    title: string;
    percentage: number | null;
    component: React.ReactNode;
}

interface AccordionListProps {
    items: AccordionItem[];
}

export const AccordionList: React.FC<AccordionListProps> = ({ items }) => {
    const [expandedId, setExpandedId] = React.useState<any>(null);

    return (
        <Box data-testid="accordion-list" role="list" aria-label="Accordion list">
            {items?.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                    <Accordion
                        key={item.id}
                        expanded={isExpanded}
                        onChange={(_, expanded) => setExpandedId(expanded ? item.id : null)}
                        data-testid={`accordion-item-${item.id}`}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            data-testid={`accordion-summary-${item.id}`}
                            aria-controls={`accordion-content-${item.id}`}
                            id={`accordion-header-${item.id}`}
                            aria-expanded={isExpanded}
                        >
                            <Typography
                                sx={{ flexGrow: 1, fontWeight: 'bold' }}
                                data-testid={`accordion-title-${item.id}`}
                            >
                                {item.title}
                            </Typography>
                            {item.percentage ? (
                                <Typography
                                    data-testid={`accordion-percentage-${item.id}`}
                                    aria-label={`${item.percentage} percent`}
                                >
                                    {`${item.percentage}%`}
                                </Typography>
                            ) : null}
                        </AccordionSummary>
                        <AccordionDetails
                            data-testid={`accordion-details-${item.id}`}
                            id={`accordion-content-${item.id}`}
                        >
                            {item.component}
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};

