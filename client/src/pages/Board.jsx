import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { api, getApiError } from '../services/api';
import { BOARD_COLUMNS } from '../utils/constants';
import { formatShortDate } from '../utils/formatters';

export const Board = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/applications', { params: { limit: 100, sort: 'followUpDate' } });
        setApplications(data.applications);
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = useMemo(
    () =>
      BOARD_COLUMNS.map((column) => ({
        ...column,
        items: applications.filter((application) => column.statuses.includes(application.status))
      })),
    [applications]
  );

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) return;

    const targetColumn = BOARD_COLUMNS.find((column) => column.id === result.destination.droppableId);
    const moved = applications.find((application) => application._id === result.draggableId);
    if (!targetColumn || !moved) return;

    const previous = applications;
    setApplications((current) =>
      current.map((application) => (application._id === moved._id ? { ...application, status: targetColumn.status } : application))
    );

    try {
      await api.patch(`/applications/${moved._id}`, { status: targetColumn.status });
      toast.success(`Moved to ${targetColumn.title}`);
    } catch (error) {
      setApplications(previous);
      toast.error(getApiError(error));
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Kanban board</p>
          <h1>Status pipeline</h1>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <section className="kanban-board" aria-label="Job application board">
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided, snapshot) => (
                <div className={`kanban-column ${snapshot.isDraggingOver ? 'is-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="kanban-header">
                    <h2>{column.title}</h2>
                    <span>{column.items.length}</span>
                  </div>
                  {column.items.map((application, index) => (
                    <Draggable draggableId={application._id} index={index} key={application._id}>
                      {(dragProvided, dragSnapshot) => (
                        <article
                          className={`kanban-card ${dragSnapshot.isDragging ? 'is-dragging' : ''}`}
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <Link to={`/applications/${application._id}`}>{application.role}</Link>
                          <p>{application.company}</p>
                          <div className="kanban-meta">
                            <StatusBadge status={application.status} />
                            <PriorityBadge priority={application.priority} />
                          </div>
                          <span className="kanban-date">
                            <CalendarClock size={14} />
                            {formatShortDate(application.followUpDate)}
                          </span>
                        </article>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </section>
      </DragDropContext>
    </div>
  );
};
