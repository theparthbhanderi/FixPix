import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FolderOpen, Image, Sparkles, Upload, Plus } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/utils';

/**
 * EmptyState - Show when there's no data/content
 */

const EmptyState = ({
    icon: Icon = FolderOpen,
    title = "No items found",
    description = "Get started by creating something new.",
    action,
    actionLabel = "Create New",
    actionTo,
    className
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "flex flex-col items-center justify-center py-16 px-6 text-center",
            className
        )}
    >
        {/* Animated Icon */}
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"
        >
            <Icon className="w-10 h-10 text-primary" />
        </motion.div>

        {/* Text */}
        <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
        <p className="text-text-secondary max-w-sm mb-6">{description}</p>

        {/* Action Button */}
        {(action || actionTo) && (
            actionTo ? (
                <Link to={actionTo}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        {actionLabel}
                    </Button>
                </Link>
            ) : (
                <Button onClick={action}>
                    <Plus className="w-4 h-4 mr-2" />
                    {actionLabel}
                </Button>
            )
        )}
    </motion.div>
);

// Pre-built empty states for common scenarios

const EmptyProjects = () => (
    <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Start restoring your first photo to see it here."
        actionTo="/app/restoration"
        actionLabel="Create First Project"
    />
);

const EmptyImages = () => (
    <EmptyState
        icon={Image}
        title="No image selected"
        description="Upload an image to start editing and enhancing."
        actionLabel="Upload Image"
    />
);

const EmptyBatch = ({ onUpload }) => (
    <EmptyState
        icon={Upload}
        title="No images in queue"
        description="Add multiple images to process them all at once."
        action={onUpload}
        actionLabel="Add Images"
    />
);

const EmptySearch = ({ query }) => (
    <EmptyState
        icon={Sparkles}
        title="No results found"
        description={`We couldn't find anything matching "${query}". Try a different search term.`}
    />
);

export { EmptyState, EmptyProjects, EmptyImages, EmptyBatch, EmptySearch };
export default EmptyState;
