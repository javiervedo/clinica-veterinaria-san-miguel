import { Add, Delete, Edit, Refresh } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { ConfirmDialog } from '../components/ConfirmDialog.jsx';
import { ErrorAlert } from '../components/ErrorAlert.jsx';
import { LoadingOverlay } from '../components/LoadingOverlay.jsx';
import { toApiError } from '../api/apiClient.js';

function guessId(row) {
  return row?.id ?? row?.ID ?? row?.Id;
}

export function CrudListPage({ title, description, service, columns, makeEmpty, mapFormToPayload }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row
  const [form, setForm] = useState(makeEmpty?.() ?? {});
  const [confirm, setConfirm] = useState({ open: false, row: null });

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const f = filter.toLowerCase();
    return items.filter((it) => JSON.stringify(it).toLowerCase().includes(f));
  }, [items, filter]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await service.list();
      setItems(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Cargamos datos al montar.
    // eslint-disable-next-line
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(makeEmpty?.() ?? {});
    setDialogOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    setForm(row);
    setDialogOpen(true);
  }

  async function save() {
    setError(null);
    setLoading(true);
    try {
      const payload = mapFormToPayload ? mapFormToPayload(form) : form;
      if (editing) {
        await service.update(guessId(editing), payload);
      } else {
        await service.create(payload);
      }
      setDialogOpen(false);
      await load();
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function remove(row) {
    setError(null);
    setLoading(true);
    try {
      await service.remove(guessId(row));
      setConfirm({ open: false, row: null });
      await load();
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={2}>
      <LoadingOverlay open={loading} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1}>
          <TextField size="small" placeholder="Buscar..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Tooltip title="Recargar">
            <IconButton onClick={load}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            Nuevo
          </Button>
        </Stack>
      </Stack>

      <ErrorAlert error={error?.message ?? null} />

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableCell key={c.key}>{c.header}</TableCell>
                ))}
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row, idx) => (
                <TableRow key={guessId(row) ?? idx} hover>
                  {columns.map((c) => (
                    <TableCell key={c.key}>{c.render ? c.render(row) : row?.[c.key]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton onClick={() => openEdit(row)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Borrar">
                      <IconButton color="error" onClick={() => setConfirm({ open: true, row })}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1}>
                    <Typography variant="body2" color="text.secondary">
                      Sin resultados.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditDialog
        open={dialogOpen}
        title={editing ? `Editar ${title}` : `Crear ${title}`}
        columns={columns}
        form={form}
        onChange={setForm}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Confirmar borrado"
        description="Esta acción no se puede deshacer."
        onClose={() => setConfirm({ open: false, row: null })}
        onConfirm={() => remove(confirm.row)}
      />
    </Stack>
  );
}

function EditDialog({ open, title, columns, form, onChange, onClose, onSave }) {
  const editableFields = columns.filter((c) => c.editable);

  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={
        <Stack spacing={2} sx={{ mt: 1 }}>
          {editableFields.map((f) => (
            <TextField
              key={f.key}
              label={f.header}
              value={form?.[f.key] ?? ''}
              onChange={(e) => onChange((v) => ({ ...v, [f.key]: e.target.value }))}
              fullWidth
            />
          ))}
        </Stack>
      }
      confirmText="Guardar"
      cancelText="Cancelar"
      onClose={onClose}
      onConfirm={onSave}
    />
  );
}
