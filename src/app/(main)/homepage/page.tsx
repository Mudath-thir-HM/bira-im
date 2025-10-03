import Card from "@/components/ui/Card";
import { SUBJECTS } from "@/lib/constants";
import Link from "next/link";

const SubjectCard: React.FC<{ subject: (typeof SUBJECTS)[0] }> = ({
  subject,
}) => (
  <Link href={`/homepage/${subject.id}`}>
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out cursor-pointer text-center">
      <img
        src={subject.image}
        alt={subject.name}
        className="w-full h-48 object-contain mb-4 rounded-lg"
      />
      <p className="text-sm font-semibold text-brand-text-secondary">
        LEVEL {subject.level}
      </p>
      <h3 className="text-2xl font-bold text-brand-text-primary mt-1">
        {subject.name}
      </h3>
    </Card>
  </Link>
);
const HomePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
        Select a Subject
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SUBJECTS.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
