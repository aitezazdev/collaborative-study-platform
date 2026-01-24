import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserClasses } from "../api/classApi";

const ClassPage = () => {
    const { classId } = useParams();
    const [cls, setCls] = useState(null);

    useEffect(() => {
        const loadClass = async () => {
            const res = await fetchUserClasses();
            const found = res.data.find(c => c._id === classId);
            setCls(found);
        };
        loadClass();
    }, [classId]);

    if (!cls) {
        return <p className="text-center mt-10 text-slate-500">Loading class...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {cls.title}
            </h1>
            <p className="text-slate-600 mb-4">{cls.description}</p>

            <div className="bg-white border rounded-lg p-6">
                <p><strong>Teacher:</strong> {cls.teacher?.name}</p>
                <p><strong>Students:</strong> {cls.students?.length}</p>
                <p><strong>Join Code:</strong> {cls.joinCode}</p>
            </div>
            <button
                onClick={() => window.history.back()}
                className="text-blue-600 mb-4"
            >
                ← Back to classes
            </button>

        </div>
    );
};

export default ClassPage;
