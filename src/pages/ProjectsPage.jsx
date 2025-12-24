import React, { useEffect, useState, useContext } from 'react';
import { ImageContext } from '../context/ImageContext';
import { useNavigate } from 'react-router-dom';
import MaterialCard from '../components/ui/MaterialCard';

const ProjectsPage = () => {
    const { fetchProjects, loadProject } = useContext(ImageContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const data = await fetchProjects();
            setProjects(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleProjectClick = (project) => {
        setCurrentProject(project);
        setOriginalImage(project.original_image); // Note: verify if backend returns full url
        setProcessedImage(project.processed_image);
        navigate('/app/restoration');
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Loading projects...</div>;

    return (
        <div className="p-8 w-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-text-main mb-6">My Projects</h1>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-border-light">
                    <p className="text-text-secondary">No projects yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <MaterialCard
                            key={project.id}
                            className="group cursor-pointer hover:scale-[1.02] transition-transform flex flex-col h-full"
                            onClick={() => {
                                loadProject(project);
                                navigate('/app/restoration');
                            }}
                        >
                            <div className="aspect-video bg-surface-highlight relative overflow-hidden mb-3 rounded-lg group-hover:shadow-md transition-shadow">
                                {/* Show processed logic */}
                                <img
                                    src={project.processed_image || project.original_image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />

                                {project.status === 'processing' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium backdrop-blur-sm">
                                        <span className="animate-pulse">Processing...</span>
                                    </div>
                                )}

                                {/* Overlay for "Open" */}
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="glass px-4 py-2 rounded-full font-bold text-text-main shadow-lg">
                                        Open Evaluator
                                    </div>
                                </div>
                            </div>

                            <h3 className="font-bold text-text-main truncate mb-1">{project.title || "Untitled Project"}</h3>
                            <div className="flex items-center justify-between mt-auto">
                                <p className="text-xs text-text-secondary">
                                    {new Date(project.created_at).toLocaleDateString()}
                                </p>
                                <div className="flex gap-1 overflow-hidden">
                                    {/* Simple chips based on settings */}
                                    {project.settings?.removeScratches && <span className="bg-blue-900/30 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-medium">Restored</span>}
                                    {project.settings?.colorize && <span className="bg-purple-900/30 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-medium">Colorized</span>}
                                    {project.settings?.upscaleX > 1 && <span className="bg-orange-900/30 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded text-[10px] font-medium">{project.settings.upscaleX}x</span>}
                                </div>
                            </div>
                        </MaterialCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
