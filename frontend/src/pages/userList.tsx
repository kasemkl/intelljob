import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/userApi";
import { Button, Typography, Container, List, ListItem } from "@mui/material";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getUsers().then((response) => setUsers(response.data));
  }, []);

  const handleDelete = (id: string) => {
    deleteUser(id).then(() => setUsers(users.filter((user) => user.id !== id)));
  };

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        User Management
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <Typography variant="body1">
              {user.name} - {user.role}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserList;
