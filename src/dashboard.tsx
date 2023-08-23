import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from './firebase';
import { doc, getDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import Select from 'react-select';
import Requirements from './requirements';
import { auth } from './firebase';
import styles from './Dashboard.module.css';
import CreatableSelect from 'react-select/creatable';




interface Semester {
    id: number;
    name: string;
    selectedClasses: { id: string, classname: string, creditNos: number }[];
    totalCredits: number;
    showSearchBar: boolean;
    addedExtraSemester?: boolean;
}

const coreClasses = [
    'ENGR 100', 'ENGR 101', 'CHEM 125', 'CHEM 126', 'CHEM 130', 'PHYS 140', 'PHYS 141', 'PHYS 240', 'PHYS 241', 'MATH 115', 'MATH 116',
    'MATH 214', 'MATH 215'
    // ... add more classes as needed
];
const ProgramCore = [
    'EECS 203',
    'EECS 280',
    'EECS 281',
    'EECS 370',
    'EECS 376',
    'EECS 496',
    'STATS 250',
    'TCHNCLCM 300'
    // ... add more classes as needed
];
const UpperLevel = [
    'EECS 367', 'EECS 373', 'EECS 388', 'EECS 390', 'EECS 427', 'EECS 440', 'EECS 441', 'EECS 442', 'EECS 445',
    'EECS 448', 'EECS 449', 'EECS 467', 'EECS 470', 'EECS 471', 'EECS 473', 'EECS 475', 'EECS 476', 'EECS 477',
    'EECS 478', 'EECS 480', 'EECS 481', 'EECS 482', 'EECS 483', 'EECS 484', 'EECS 485', 'EECS 486', 'EECS 487',
    'EECS 489', 'EECS 490', 'EECS 491', 'EECS 492', 'EECS 493', 'EECS 494', 'EECS 495', 'EECS 497'
];
const FlexTech = [
    'SI 206', 'SI 301', 'SI 339', 'SI 364', 'SI 422', 'SI 630'
];

const IntellectualBreadth = [

];
const GeneralElectives = [

];
const alternativeClassesMap: { [key: string]: string[]; } =
{
    'ENGR 101': ['ENGR 151', 'ROB 102']
    // Add more mappings as needed
};


const NewClassModal: React.FC<{ onClose: () => void, onSave: (classname: string, credits: number) => void }> = ({ onClose, onSave }) => {
    const [classname, setClassname] = useState("");
    const [credits, setCredits] = useState<number | "">("");

    return (
        <div className={styles.modal}>
            <h2>Add New Class</h2>
            <input
                type="text"
                value={classname}
                onChange={e => setClassname(e.target.value)}
                placeholder="Class Name"
            />
            <input
                type="number"
                value={credits}
                onChange={e => setCredits(e.target.value ? parseInt(e.target.value) : "")}
                placeholder="Credits"
            />
            <button onClick={() => {
                if (classname && credits !== "") {
                    onSave(classname, credits);
                    setClassname("");
                    setCredits("");
                    onClose();
                } else {
                    alert("Please fill all fields");
                }
            }}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

const Dashboard: React.FC = () => {
    // ... (rest of the states and useEffect)
    // ... (rest of the states and useEffect)
    const [classes, setClasses] = useState<{ id: string, classname: string, creditNos: number }[]>([]);
    const [fulfilledCredits, setFulfilledCredits] = useState<number>(0);
    const [programCoreFulfilledCredits, setProgramCoreFulfilledCredits] = useState<number>(0);
    const [upperLevelFulfilledCredits, setUpperLevelFulfilledCredits] = useState<number>(0);
    const [flexTechFulfilledCredits, setFlexTechFulfilledCredits] = useState<number>(0);
    const [generalFulfilledCredits, setGeneralFulfilledCredits] = useState<number>(0);
    const [mdelFulfilledCredits, setmdeFulfilledCredits] = useState<number>(0);
    const [intellectualFulfilledCredits, setIntellectualFulfilledCredits] = useState<number>(0);
    const [addedExtraSemesters, setAddedExtraSemesters] = useState<Set<number>>(new Set());
    const [addedCreditsBefore, setAddedCreditsBefore] = useState<boolean>(false);
    const [newClass, setNewClass] = useState({ classname: '', creditNos: 0 });
    const [generalElectives, setGeneralElectives] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [semesters, setSemesters] = useState<Semester[]>([
        { id: 1, name: 'Fall Year 1', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 2, name: 'Winter Year 1', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 3, name: 'Fall Year 2', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 4, name: 'Winter Year 2', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 5, name: 'Fall Year 3', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 6, name: 'Winter Year 3', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 7, name: 'Fall Year 4', selectedClasses: [], totalCredits: 0, showSearchBar: false },
        { id: 8, name: 'Winter Year 4', selectedClasses: [], totalCredits: 0, showSearchBar: false },

        // Initialized with Fall 2022, you ca add more by default if needed.
    ]);

    useEffect(() => {
        console.log("Running useeffect");

        async function fetchUserSemesters() {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRef = doc(firestore, 'users', userId);
                const userData = await getDoc(userRef);
                if (userData.exists() && userData.data()?.semesters) {
                    setSemesters(userData.data().semesters);
                }
            }
            else {

            }
        }

        async function fetchData() {
            const querySnapshot = await getDocs(collection(firestore, 'classes'));
            const classData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                classname: doc.data().classname || '',
                creditNos: doc.data().creditNos || 0
            }));
            setClasses(classData);
        }

        fetchData();
        fetchUserSemesters(); // Fetch user-specific semesters
    }, []);

    useEffect(() => {

        calcGeneralElectives();
        calcCoeCore();
        calcProgramCore();
        calcUpperLevel();
        calcFlexTech();
    }, [semesters]);  // Recalculate general electives whenever `semesters` changes


    const saveUserSemesters = async () => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const userRef = doc(firestore, 'users', userId);
            const userData = {
                semesters
            };
            await updateDoc(userRef, { semesters });
        }
    };

    const handleAddNewClass = (classname: string) => {
        setShowModal(true);
    };

    const handleSaveNewClass = async (classname: string, credits: number) => {
        const existingClass = classes.find(cls => cls.classname === classname);
        if (existingClass) {
            alert("This class already exists.");
            return;
        }

        const newClassData = { classname, creditNos: credits };

        const classRef = collection(firestore, 'classes');
        const docRef = await addDoc(classRef, newClassData);

        setClasses(prevClasses => [...prevClasses, { ...newClassData, id: docRef.id }]);
    };


    const handleClassDeletion = (semesterId: number, classId: string) => {
        setSemesters(prevSemesters => {
            return prevSemesters.map(semester => {
                if (semester.id === semesterId) {
                    const classToDelete = semester.selectedClasses.find(c => c.id === classId);
                    return {
                        ...semester,
                        selectedClasses: semester.selectedClasses.filter(c => c.id !== classId),
                        totalCredits: classToDelete
                            ? semester.totalCredits - classToDelete.creditNos
                            : semester.totalCredits
                    };
                }
                return semester;
            });
        });
        calcGeneralElectives();
        calcCoeCore();
        calcProgramCore();
        calcUpperLevel();
        calcFlexTech();
        saveUserSemesters();
    };

    const handleAlternativeClasses = (selectedCls: any) => {
        for (let coreClass in alternativeClassesMap) {
            if (alternativeClassesMap[coreClass].includes(selectedCls.classname) &&
                !allSelectedClasses.includes(coreClass)) {
                return 'CoE Core';
            }
        }
        if (ProgramCore.includes(selectedCls.classname)) {
            return 'Program Core';
        }
        // Add checks for other categories if needed
    };


    const calcGeneralElectives = () => {
        // Getting all the selected classes
        const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses);

        // Filter the classes to determine the general electives
        const generalElectivesClasses = allSelectedClasses.filter(selectedCls => {
            return (
                !coreClasses.includes(selectedCls.classname) &&
                !ProgramCore.includes(selectedCls.classname) &&
                !UpperLevel.includes(selectedCls.classname) &&
                !FlexTech.includes(selectedCls.classname) &&
                !alternativeClassesMap[selectedCls.classname]
            );
        });
        const generalElectivesNames = generalElectivesClasses.map(cls => cls.classname);
        const generalElectivesCredits = generalElectivesClasses.reduce((acc, cls) => acc + cls.creditNos, 0);

        setGeneralElectives(generalElectivesNames);
        setGeneralFulfilledCredits(generalElectivesCredits);

    }

    const calcCoeCore = () => {
        const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses);
        let coreCredits = 0;
        let programCoreCredits = 0;
        for (const selectedCls of allSelectedClasses) {
            const category = handleAlternativeClasses(selectedCls);
            if (category === 'CoE Core') {
                coreCredits += selectedCls.creditNos;
            } else if (category === 'Program Core') {
                programCoreCredits += selectedCls.creditNos;
            }
        }

        setFulfilledCredits(coreCredits);
        setProgramCoreFulfilledCredits(programCoreCredits); // Update Program Core credits here
    };

    const calcProgramCore = () => {
        const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses);

        const ProgramCoreClasses = allSelectedClasses.filter(selectedCls => ProgramCore.includes(selectedCls.classname));

        const coreCredits = ProgramCoreClasses.reduce((acc, cls) => acc + cls.creditNos, 0);

        setProgramCoreFulfilledCredits(coreCredits);
    }
    const calcUpperLevel = () => {
        const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses);

        const upperLevelClasses = allSelectedClasses.filter(selectedCls => UpperLevel.includes(selectedCls.classname));

        const coreCredits = upperLevelClasses.reduce((acc, cls) => acc + cls.creditNos, 0);

        setUpperLevelFulfilledCredits(coreCredits);
    }
    const calcFlexTech = () => {
        const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses);

        const coreElectivesClasses = allSelectedClasses.filter(selectedCls => FlexTech.includes(selectedCls.classname));

        const coreCredits = coreElectivesClasses.reduce((acc, cls) => acc + cls.creditNos, 0);

        setFlexTechFulfilledCredits(coreCredits);
    }

    const handleClassSelect = (semesterId: number, selectedOption: any, actionMeta: any) => {
        if (actionMeta.action === "create-option") {
            handleAddNewClass(selectedOption.value);  // Assuming you want to add the class immediately when selected
            return;
        }

        const selectedCls = classes.find(cls => cls.id === selectedOption.value);
        if (selectedCls) {
            setSemesters(prevSemesters => prevSemesters.map(semester => {
                if (semester.id === semesterId && !semester.selectedClasses.some(cls => cls.id === selectedCls.id)) {
                    return {
                        ...semester,
                        selectedClasses: [...semester.selectedClasses, selectedCls],
                        totalCredits: semester.totalCredits + selectedCls.creditNos,
                        showSearchBar: false
                    };
                }

                return semester;
            }));

        }
        saveUserSemesters();

    };




    const addSemesterAfter = (index: number) => {
        const newSemester: Semester = {
            id: Date.now(),
            name: `Spring Semester`,
            selectedClasses: [],
            totalCredits: 0,
            showSearchBar: false
        };
        setSemesters(prevSemesters => [
            ...prevSemesters.slice(0, index + 1),
            newSemester,
            ...prevSemesters.slice(index + 1)
        ]);
        setAddedExtraSemesters(prevIndexes => new Set(prevIndexes).add(index));
        saveUserSemesters();
    }

    const addSemesterBefore = (index: number) => {
        const newSemester: Semester = {
            id: Date.now(),
            name: 'Credits Before',
            selectedClasses: [],
            totalCredits: 0,
            showSearchBar: false
        };
        setSemesters(prevSemesters => [
            ...prevSemesters.slice(0, index),
            newSemester,
            ...prevSemesters.slice(index)

        ]);
        saveUserSemesters();
        setAddedCreditsBefore(true);
    }





    const allSemestersTotalCredits = semesters.reduce((acc, semester) => acc + semester.totalCredits, 0);
    const allSelectedClasses = semesters.flatMap(semester => semester.selectedClasses.map(cls => cls.classname));

    return (
        <div className="dashboard">

            {showModal && <NewClassModal onClose={() => setShowModal(false)} onSave={handleSaveNewClass} />}
            <div className={styles.dashboardContainer}>
                <div className={`${styles.column} ${styles.semesterClasses}`}>
                    <Requirements label="Core Classes" fulfilledCredits={fulfilledCredits} selectedClasses={allSelectedClasses} />
                    <Requirements label="Program Core" fulfilledCredits={programCoreFulfilledCredits} selectedClasses={allSelectedClasses} />
                    <Requirements label="Upper Level" fulfilledCredits={upperLevelFulfilledCredits} selectedClasses={allSelectedClasses} />
                    <Requirements label="Flex Tech" fulfilledCredits={flexTechFulfilledCredits} selectedClasses={allSelectedClasses} />
                    <Requirements label="General" fulfilledCredits={generalFulfilledCredits} selectedClasses={generalElectives} />
                </div>

                {/*<div>
                    <h3>Add a new class</h3>
                    <input
                        type="text"
                        placeholder="Class Name"
                        value={newClass.classname}
                        onChange={e => setNewClass(prev => ({ ...prev, classname: e.target.value }))}
                    />
                    <input
                        type="number"
                        placeholder="Credit Number"
                        value={newClass.creditNos}
                        onChange={e => setNewClass(prev => ({ ...prev, creditNos: parseInt(e.target.value) }))}
                    />
                    <button onClick={handleAddNewClass}>Add Class</button>
                </div>*/}
                <div className={`${styles.column} ${styles.semesterContainer}`}>
                    {!addedCreditsBefore && (
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <button onClick={() => addSemesterBefore(0)}>+</button>
                        </div>
                    )}
                    {semesters.map((semester, index) => (
                        <React.Fragment>
                            <div key={semester.id} className={styles.semesterBox}>
                                <div style={{ marginBottom: '20px', border: '1px solid black', width: '300px', textAlign: 'center', padding: '10px' }}>
                                    <h3>{semester.name}</h3>
                                    {semester.selectedClasses.map(cls => (
                                        <div key={cls.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p>{cls.classname}</p>
                                            <button onClick={() => handleClassDeletion(semester.id, cls.id)}>Delete</button>
                                        </div>
                                    ))}
                                    {semester.showSearchBar ? (
                                        <CreatableSelect
                                            options={classes.map(cls => ({ value: cls.id, label: cls.classname }))}
                                            onChange={(option, actionMeta) => handleClassSelect(semester.id, option, actionMeta)}
                                            placeholder="Search for a class"
                                        />

                                    ) : (
                                        <button onClick={() => setSemesters(prevSemesters =>
                                            prevSemesters.map(s => s.id === semester.id ? { ...s, showSearchBar: true } : s)
                                        )}>+</button>
                                    )}
                                    <h4>Total Credits: {semester.totalCredits}</h4>
                                </div>

                                {semester.name.includes("Winter") && !addedExtraSemesters.has(index) && (
                                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                        <button onClick={() => addSemesterAfter(index)}>+</button>
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                    <h2>Overall Total Credits: {allSemestersTotalCredits}</h2>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


