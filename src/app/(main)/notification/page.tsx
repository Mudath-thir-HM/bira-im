import Card from "@/components/ui/Card";
import { Icon, MOCK_NOTIFICATIONS } from "@/lib/constants";

const Notifications = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
        Notifications
      </h1>
      <Card className="max-w-2xl mx-auto">
        <ul className="space-y-3">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 rounded-lg flex items-start space-x-4 ${
                notif.read ? "bg-brand-background" : "bg-brand-primary"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                <Icon
                  name="notification"
                  className={`w-6 h-6 ${
                    notif.read
                      ? "text-brand-text-secondary"
                      : "text-brand-secondary"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-brand-text-primary ${
                    !notif.read && "font-semibold"
                  }`}
                >
                  {notif.text}
                </p>
                <p className="text-sm text-brand-text-secondary mt-1">
                  {notif.timestamp}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Notifications;
