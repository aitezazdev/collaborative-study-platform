import TeacherClassCard from "./TeacherClassCard";
import StudentClassCard from "./StudentClassCard";

const ClassSection = ({
  title,
  icon: Icon,
  classes,
  type,
  showMenu,
  setShowMenu,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Icon size={20} className="text-gray-700" />
        {title} ({classes.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) =>
          type === "teacher" ? (
            <TeacherClassCard
              key={cls._id}
              cls={cls}
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <StudentClassCard key={cls._id} cls={cls} />
          )
        )}
      </div>
    </div>
  );
};

export default ClassSection;