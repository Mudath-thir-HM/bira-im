import { Icon } from "@/lib/constants";
import { Achievement } from "@/lib/types";
import Card from "./ui/Card";

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-brand-primary flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-text-primary">
            Achievements Gained
          </h2>
          <button
            onClick={onClose}
            className="text-brand-text-secondary hover:text-brand-text-primary cursor-pointer"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          {achievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((ach) => (
                <Card
                  key={ach.id}
                  className="text-center flex flex-col items-center p-4"
                >
                  <div className="p-3 bg-brand-primary rounded-full mb-3">
                    <Icon
                      name={ach.icon as "trophy"}
                      className="w-10 h-10 text-brand-secondary"
                    />
                  </div>
                  <h3 className="font-bold text-brand-text-primary">
                    {ach.name}
                  </h3>
                  <p className="text-sm text-brand-text-secondary mt-1">
                    {ach.description}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-brand-text-secondary">
                No achievements yet. Keep learning to earn some!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
