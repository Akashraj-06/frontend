import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomDialog from '../components/CustomDialog';
import { getWorkerJobs, acceptJob, completeJob } from '../api/job';
import '../styles/WorkerDashboard.css';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // Tracks ID of job currently being processed

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = (message, onConfirm) => {
    setDialogConfig({
      isOpen: true,
      title: 'Confirm Action',
      message,
      type: 'confirm',
      onConfirm: () => {
        setDialogConfig(prev => ({ ...prev, isOpen: false }));
        onConfirm();
      },
      onCancel: () => setDialogConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showAlert = (message) => {
    setDialogConfig({
      isOpen: true,
      title: 'Notification',
      message,
      type: 'alert',
      onConfirm: () => setDialogConfig(prev => ({ ...prev, isOpen: false })),
      onCancel: () => setDialogConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== 'WORKER') {
        navigate('/dashboard'); // Customers get redirected back
        return;
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const data = await getWorkerJobs();
      setJobs(data);
    } catch (err) {
      let msg = 'Failed to load jobs.';
      if (err.response) {
        msg = err.response.data?.message || err.response.data || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (serviceRequestId) => {
    showConfirm('Are you sure you want to accept this service request?', async () => {
      setActionLoading(serviceRequestId);
      try {
        await acceptJob(serviceRequestId);
        await fetchJobs(); // Refresh jobs list
      } catch (err) {
        let msg = 'Failed to accept job.';
        if (err.response) {
          msg = err.response.data?.message || err.response.data || msg;
        }
        showAlert(msg);
      } finally {
        setActionLoading(null);
      }
    });
  };

  const handleComplete = (jobAssignmentId, serviceRequestId) => {
    showConfirm('Are you sure you want to mark this job as completed?', async () => {
      setActionLoading(serviceRequestId);
      try {
        await completeJob(jobAssignmentId);
        await fetchJobs(); // Refresh jobs list
      } catch (err) {
        let msg = 'Failed to complete job.';
        if (err.response) {
          msg = err.response.data?.message || err.response.data || msg;
        }
        showAlert(msg);
      } finally {
        setActionLoading(null);
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Summary counts
  const pendingJobsCount = jobs.filter(j => j.status === 'PENDING').length;
  const completedJobsCount = jobs.filter(j => j.status === 'COMPLETED').length;
  const assignedJobsCount = jobs.filter(j => j.status === 'ASSIGNED').length;

  return (
    <div className="worker-dashboard-page">
      <Navbar />

      <div className="worker-dashboard-content">
        <header className="worker-dashboard-header">
          <h1 className="worker-dashboard-title">Worker Dashboard</h1>
          <p className="worker-dashboard-subtitle">Manage and track your assigned jobs</p>
        </header>

        {loading ? (
          <div className="worker-dashboard-loading">
            <div className="worker-dashboard-spinner" />
            <p>Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="worker-dashboard-error">
            <h2>Oops!</h2>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="worker-summary-grid">
              <div className="worker-summary-card">
                <span className="worker-summary-label">Total Assigned Jobs</span>
                <span className="worker-summary-value">{assignedJobsCount}</span>
              </div>
              <div className="worker-summary-card">
                <span className="worker-summary-label">Pending Jobs</span>
                <span className="worker-summary-value">{pendingJobsCount}</span>
              </div>
              <div className="worker-summary-card">
                <span className="worker-summary-label">Completed Jobs</span>
                <span className="worker-summary-value">{completedJobsCount}</span>
              </div>
            </div>

            {/* Jobs List */}
            <section className="worker-jobs-section">
              <h2>Your Job List</h2>

              {jobs.length === 0 ? (
                <div className="worker-dashboard-empty">
                  <span className="worker-dashboard-empty-icon" aria-hidden="true">🛠️</span>
                  <h3 className="worker-dashboard-empty-title">No Jobs Assigned</h3>
                  <p className="worker-dashboard-empty-msg">
                    You don&apos;t have any service requests or assignments currently.
                  </p>
                </div>
              ) : (
                <div className="worker-jobs-list">
                  {jobs.map((job) => (
                    <div key={job.id} className="worker-job-card">
                      <div className="worker-job-header">
                        <div className="worker-job-info">
                          <h3>{job.categoryName || 'Service Job'}</h3>
                          <span className="worker-job-date">
                            Requested on {formatDate(job.requestedDate)}
                          </span>
                        </div>
                        <span className={`worker-job-status ${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </div>

                      <div className="worker-job-details">
                        <div className="worker-job-detail-group">
                          <span className="worker-job-detail-label">Customer</span>
                          <span className="worker-job-detail-value">{job.customerName}</span>
                        </div>

                        {job.address && (
                          <div className="worker-job-detail-group">
                            <span className="worker-job-detail-label">Address</span>
                            <span className="worker-job-detail-value">{job.address}</span>
                          </div>
                        )}

                        {job.description && (
                          <div className="worker-job-detail-group" style={{ gridColumn: 'span 2' }}>
                            <span className="worker-job-detail-label">Description</span>
                            <span className="worker-job-detail-value">{job.description}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {job.status === 'PENDING' && (
                        <div className="worker-job-actions">
                          <button
                            className="worker-action-btn"
                            onClick={() => handleAccept(job.id)}
                            disabled={actionLoading !== null}
                          >
                            {actionLoading === job.id ? 'Accepting...' : 'Accept Job'}
                          </button>
                        </div>
                      )}

                      {job.status === 'ASSIGNED' && (
                        <div className="worker-job-actions">
                          <button
                            className="worker-action-btn"
                            onClick={() => handleComplete(job.jobAssignmentId, job.id)}
                            disabled={actionLoading !== null}
                          >
                            {actionLoading === job.id ? 'Completing...' : 'Complete Job'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
      <CustomDialog
        isOpen={dialogConfig.isOpen}
        title={dialogConfig.title}
        message={dialogConfig.message}
        type={dialogConfig.type}
        onConfirm={dialogConfig.onConfirm}
        onCancel={dialogConfig.onCancel}
      />
    </div>
  );
}
