 type NotificationCard = {
  title: string;
  description: string;
  time: string;

  badge: {
    text: string;
    className: string;
  };

  className?: string;
};