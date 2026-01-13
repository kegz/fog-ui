import React from 'react';
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemButton, ListItemIcon } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define the structure for the list item
export interface ListItemData {
    id: any;
    title: string;
    icon?: React.ReactNode; // For dynamic icons
    link?: string; // Optional link makes the item clickable
}

// Props for the generic list component
interface GenericListProps {
    items: ListItemData[];
}

export const GenericList: React.FC<GenericListProps> = ({ items }) => {
    const navigate = useNavigate();

    const handleItemClick = (link?: string) => {
        if (link) {
            navigate(link);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent, link?: string) => {
        if ((event.key === 'Enter' || event.key === ' ') && link) {
            event.preventDefault();
            handleItemClick(link);
        }
    };

    return (
        <List
            data-testid="generic-list"
            role="list"
            aria-label="Navigation list"
        >
            {items?.map((item) => (
                <ListItem
                    key={item.id}
                    disablePadding
                    onClick={() => handleItemClick(item.link)}
                    data-testid={`list-item-${item.id}`}
                >
                    <ListItemButton
                        component={item.link ? 'a' : 'div'}
                        href={item.link}
                        disabled={!item.link}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, item.link)}
                        data-testid={`list-item-button-${item.id}`}
                        aria-label={item.title}
                        role="listitem"
                    >
                        {item.icon ? (
                            <ListItemIcon
                                data-testid={`list-item-icon-${item.id}`}
                                aria-hidden="true"
                            >
                                {item.icon}
                            </ListItemIcon>
                        ) : null}
                        <ListItemText
                            primary={item.title}
                            data-testid={`list-item-text-${item.id}`}
                        />
                        {item.link && (
                            <ArrowForwardIosIcon
                                aria-hidden="true"
                                data-testid={`list-item-arrow-${item.id}`}
                            />
                        )}
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

