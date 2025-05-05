'use client';

import { useState } from 'react';
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
} from '@/lib/api/messagesApi';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export function MessageTable() {
  const { data: messages = [] } = useGetMessagesQuery();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditedContent(content);
  };

  const handleSave = async () => {
    if (editingId !== null) {
      await updateMessage({ id: editingId, content: editedContent });
      setEditingId(null);
    }
  };

  const confirmDelete = async () => {
    if (pendingDeleteId !== null) {
      await deleteMessage(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id}>
              <TableCell>{msg.id}</TableCell>
              <TableCell>
                {editingId === msg.id ? (
                  <Input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  msg.content
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                {editingId === msg.id ? (
                  <Button size="sm" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleEdit(msg.id, msg.content)}>
                    Edit
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setPendingDeleteId(msg.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this message?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
