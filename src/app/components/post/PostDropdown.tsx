"use client";

import { Box, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { deletePost } from "@/app/lib/posts";

interface PostDropdownProps {
  post_id: number;
  onDelete: () => void;
}

export default function PostDropdown({
  post_id,
  onDelete,
}: Readonly<PostDropdownProps>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (
    event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    setAnchorEl(null);

    try {
      onDelete();
      await deletePost(post_id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        aria-controls={openMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? "true" : undefined}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        disableScrollLock={true}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete Post
        </MenuItem>
      </Menu>
    </Box>
  );
}
