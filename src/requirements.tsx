import React from 'react';

interface ClassRequirement {
    name: string;
    credits: number;
}

interface RequirementsProps {
    fulfilledCredits: number;
    selectedClasses: string[];
    label: string;
}

const Requirements: React.FC<RequirementsProps> = ({ fulfilledCredits, selectedClasses, label }) => {
    const CoeCoreRequirements = [
        'ENGR 100',
        'ENGR 101',
        'CHEM 125',
        'CHEM 126',
        'CHEM 130',
        'PHYS 140',
        'PHYS 141',
        'PHYS 240',
        'PHYS 241',
        'MATH 115', 'MATH 116',
        'MATH 214', 'MATH 215'

        // ... add more classes as needed
    ];
    const ProgramCore = [
        'EECS 203',
        'EECS 280', 'EECS 281',
        'EECS 370',
        'EECS 376',
        'EECS 496',
        'STATS 250',
        'TCHNCLCM 300'
        // ... add more classes as needed
    ];
    //change this print code cause we have to do only 16 of these so everytime one of them is done we print it out 
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
        ''

    ];
    const alternativeClassesMap: {
        [key: string]: string[];
    } = {
        'ENGR 101': ['ENGR 151', 'ROB 102']
        // Add more mappings as needed
    };


    const isRequirementFulfilled = (requirement: string): boolean => {
        if (selectedClasses.includes(requirement)) return true;

        const alternativeClasses = alternativeClassesMap[requirement];
        if (alternativeClasses) {
            return alternativeClasses.some(altClass => selectedClasses.includes(altClass));
        }
        return false;
    };
    return (
        <div className="requirements">
            {label === "Core Classes" && (
                <>
                    <h2>Coe Core Requirements - Fulfilled Credits: {fulfilledCredits}</h2>
                    <ul>
                        {CoeCoreRequirements.map((classRequirement, index) => (
                            <li key={index}>
                                {classRequirement} {isRequirementFulfilled(classRequirement) && ' (done)'}
                            </li>
                        ))}
                    </ul>
                </>)}
            {label == "Program Core" && (
                <>
                    <h2>Program Core Requirements {fulfilledCredits}</h2>
                    <ul>
                        {ProgramCore.map((classRequirement, index) => (
                            <li key={index}>{classRequirement}
                                {isRequirementFulfilled(classRequirement) && ' (done)'}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {label == "Upper Level" && (
                <>
                    <h2>Upper Level Classes {fulfilledCredits}</h2>
                    <h3>Should Complete 16 credits </h3>
                    <ul>
                        {UpperLevel.filter(isRequirementFulfilled).map((classRequirement, index) => (
                            <li key={index}>
                                {classRequirement} (done)
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {label == "Flex Tech" && (
                <>
                    <h2>Flexible Technical Electives {fulfilledCredits}</h2>
                    <h3>Should Complete 10 credits </h3>
                    <ul>
                        {FlexTech.filter(isRequirementFulfilled).map((classRequirement, index) => (
                            <li key={index}>
                                {classRequirement} (done)
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {label === "General" && (
                <>
                    <h2>General Electives {fulfilledCredits}</h2>
                    <h3>Should Complete 15 credits </h3>
                    <ul>
                        {selectedClasses.map((selectedClass, index) => (
                            <li key={index}>
                                {selectedClass} (done)
                            </li>
                        ))}
                    </ul>
                </>
            )}


        </div>
    );
}

export default Requirements;
