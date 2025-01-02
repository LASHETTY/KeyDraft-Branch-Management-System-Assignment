import React, { useState, useEffect, useCallback } from 'react';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/branches';

const BranchTable = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    branchName: '',
    branchCode: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
    email: '',
    status: 'Active',
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    { 
      field: 'branchName', 
      headerName: 'Branch Name', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'branchCode', 
      headerName: 'Branch Code', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'address', 
      headerName: 'Address', 
      flex: 1.5,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'city', 
      headerName: 'City', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'state', 
      headerName: 'State', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'country', 
      headerName: 'Country', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'pincode', 
      headerName: 'Pincode', 
      flex: 0.8,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      headerClassName: 'super-app-theme--header',
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'Active' ? '#e8f5e9' : '#ffebee',
            color: params.value === 'Active' ? '#2e7d32' : '#c62828',
            padding: '4px 8px',
            borderRadius: '4px',
            width: '80px',
            textAlign: 'center',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={() => handleEdit(params.row)}
            sx={{ 
              color: 'primary.main',
              '&:hover': { backgroundColor: 'primary.light' },
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleDelete(params.row._id)}
            sx={{ 
              color: 'error.main',
              '&:hover': { backgroundColor: 'error.light' },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}?page=${page + 1}&limit=${pageSize}`
      );
      setRows(response.data.branches);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await axios.put(`${API_URL}/${editData._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setOpen(false);
      setEditData(null);
      setFormData({
        branchName: '',
        branchCode: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        phone: '',
        email: '',
        status: 'Active',
      });
      fetchBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setFormData(row);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBranches();
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_URL}/import`, formData);
        fetchBranches();
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/export`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'branches.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', width: '100%', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{ 
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              Add Branch
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<FileUploadIcon />}
              sx={{ 
                backgroundColor: 'success.main',
                '&:hover': { backgroundColor: 'success.dark' },
              }}
            >
              Import Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xls"
                onChange={handleImport}
              />
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              sx={{ 
                backgroundColor: 'info.main',
                '&:hover': { backgroundColor: 'info.dark' },
              }}
            >
              Export Excel
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton 
              onClick={() => setViewMode('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton 
              onClick={() => setViewMode('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
            >
              <ListViewIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            height: 'calc(100vh - 220px)',
            width: '100%',
            '& .super-app-theme--header': {
              backgroundColor: '#f5f5f5',
              color: 'primary.main',
              fontWeight: 'bold',
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            rowCount={totalRows}
            pagination
            paginationMode="server"
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[10, 25, 50]}
            getRowId={(row) => row._id}
            components={{
              Toolbar: GridToolbar,
            }}
            loading={loading}
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
          />
        </Box>
      </Paper>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            px: 3,
            py: 2,
          }}
        >
          {editData ? 'Edit Branch' : 'Add Branch'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Branch Name"
                value={formData.branchName}
                onChange={(e) =>
                  setFormData({ ...formData, branchName: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Branch Code"
                value={formData.branchCode}
                onChange={(e) =>
                  setFormData({ ...formData, branchCode: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                fullWidth
                multiline
                rows={3}
                variant="outlined"
              />
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="State"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                fullWidth
                variant="outlined"
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                px: 4,
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              {editData ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BranchTable;
