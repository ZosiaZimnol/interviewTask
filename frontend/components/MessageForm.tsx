'use client';

import { useState } from 'react';
import { useAddMessageMutation } from '@/lib/api/messagesApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MessageForm() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [addMessage, { isLoading }] = useAddMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      setError('Message cannot be empty');
      return;
    }

    if (trimmed.length > 255) {
      setError('Message cannot exceed 255 characters');
      return;
    }

    setError('');
    try {
      await addMessage({ content: trimmed }).unwrap();
      setContent('');
    } catch (err) {
      console.error('Error adding message:', err);
      setError('An error occurred while adding the message');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4 max-w-md">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your message"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        Add
      </Button>
    </form>
  );
}
