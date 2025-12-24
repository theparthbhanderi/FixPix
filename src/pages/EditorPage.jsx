import React from 'react';
import ToolsPanel from '../components/layout/ToolsPanel';
import ImageWorkspace from '../components/features/ImageWorkspace';
import OnboardingTour from '../components/features/OnboardingTour';

const EditorPage = () => {
    const [showTools, setShowTools] = React.useState(true);

    return (
        <div className="w-screen h-screen bg-background overflow-hidden relative flex">
            {/* Onboarding Tour */}
            <OnboardingTour />

            {/* ImageWorkspace takes full space */}
            <div className="flex-1 h-full relative" data-tour="upload-zone">
                <ImageWorkspace
                    isPanelOpen={showTools}
                    togglePanel={() => setShowTools(!showTools)}
                />
            </div>
            {/* ToolsPanel visibility controlled by state */}
            <div
                className={`transition-all duration-300 ${showTools ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full absolute right-0'}`}
                data-tour="tools-panel"
            >
                <ToolsPanel />
            </div>
        </div>
    );
};

export default EditorPage;
