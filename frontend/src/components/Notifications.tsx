import React, { useEffect, useState } from "react";
import useAxios from "../hooks/useAxios";
import { MDBListGroup, MDBListGroupItem, MDBBtn } from "mdb-react-ui-kit";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const api = useAxios();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/notifications/notifications/");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/api/notifications/notifications/${id}/`, { is_read: true });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
        <div>
        <h1>Notifications</h1>
    <MDBListGroup>
      {notifications.length === 0 ? (
        <MDBListGroupItem className="text-center">
          No notifications
        </MDBListGroupItem>
      ) : (
        notifications.map((notification) => (
          <MDBListGroupItem
            key={notification.id}
            className={notification.is_read ? "text-muted" : ""}
          >
            {notification.message}
            {!notification.is_read && (
              <MDBBtn  className='make-read' style={{    position: 'absolute',
    right: '15px'
}} size="sm" onClick={() => markAsRead(notification.id)}>
                Mark as Read
              </MDBBtn>
            )}
          </MDBListGroupItem>
        ))
      )}
    </MDBListGroup>
   </div>
  );
};

export default Notifications;
