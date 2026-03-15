"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Box } from "lucide-react";
import { useTranslations } from 'next-intl';
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import Dialog from "@/components/features/shared/Dialog";
import { Input } from "@/components/ui/Input";
import SearchInput from "@/components/ui/SearchInput";
import { formatBaht, formatUsage, Room } from '@/lib/data/mockApp';
import { localizeRoomName } from '@/lib/i18n/localize';
import { monthlyService } from '@/lib/services/monthlyService';

export default function RoomsPage() {
  const t = useTranslations();
  const [rooms, setRooms] = useState<Room[]>(monthlyService.getRoomsWithSummaries());
  const [search, setSearch] = useState("");
  
  // Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form state
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [roomNameInput, setRoomNameInput] = useState("");

  // Filtering
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNameInput.trim()) return;
    
    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomNameInput.trim(),
      summary: {
        applianceCount: 0,
        totalUsageKwh: 0,
        monthlyCost: 0,
      },
    };
    setRooms([...rooms, newRoom]);
    setIsAddOpen(false);
    setRoomNameInput("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom || !roomNameInput.trim()) return;

    setRooms(rooms.map(room => 
      room.id === currentRoom.id ? { ...room, name: roomNameInput.trim() } : room
    ));
    setIsEditOpen(false);
    setCurrentRoom(null);
    setRoomNameInput("");
  };

  const handleDeleteSubmit = () => {
    if (!currentRoom) return;
    setRooms(rooms.filter(room => room.id !== currentRoom.id));
    setIsDeleteOpen(false);
    setCurrentRoom(null);
  };

  const openEdit = (room: Room) => {
    setCurrentRoom(room);
    setRoomNameInput(room.name);
    setIsEditOpen(true);
  };

  const openDelete = (room: Room) => {
    setCurrentRoom(room);
    setIsDeleteOpen(true);
  };

  return (
    <main className="flex flex-col gap-6 md:gap-8 pb-8 w-full max-w-5xl mx-auto min-h-full">
      {/* Header section */}
      <div className="w-full pt-4 md:pt-6 lg:pt-8 px-4 md:px-6 lg:px-8 flex flex-col gap-5 md:gap-6">
        <PageHeader
          title={t('rooms.title')}
          subtitle={t('rooms.subtitle')}
          actions={null}
        />
      </div>

      {/* Main Content Area */}
      <div className="w-full px-4 md:px-6 lg:px-8 flex flex-col gap-6 pb-12">

      {/* Controls Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <SearchInput 
            placeholder={t('rooms.searchRooms')} 
            value={search}
            onChange={setSearch} 
          />
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setRoomNameInput("");
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          {t('rooms.addRoom')}
        </Button>
      </div>

      {/* Rooms List / Table */}
      <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200/50 text-base-content/60 text-sm">
              <tr>
                 <th className="font-semibold px-6 py-4 rounded-tl-2xl">{t('rooms.roomName')}</th>
                 <th className="font-semibold px-6 py-4">{t('rooms.appliances')}</th>
                 <th className="font-semibold px-6 py-4">{t('rooms.usage')}</th>
                 <th className="font-semibold px-6 py-4">{t('rooms.monthlyCost')}</th>
                 <th className="font-semibold px-6 py-4 w-24 rounded-tr-2xl text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-base-content/50">
                      {t('rooms.noRoomsFoundMatching', { query: search })}
                    </td>
                  </tr>
               ) : (
                filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-0">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                          <Box size={18} />
                        </div>
                         <span className="font-medium text-base-content">{localizeRoomName(room.name, t)}</span>
                        </div>
                      </td>
                     <td className="px-6 py-4 text-base-content/70 font-medium">{room.summary.applianceCount}</td>
                     <td className="px-6 py-4 text-base-content/70 font-medium">{formatUsage(room.summary.totalUsageKwh)}</td>
                     <td className="px-6 py-4 text-base-content font-semibold">{formatBaht(room.summary.monthlyCost)}</td>
                     <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(room)}
                          className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => openDelete(room)}
                          className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col divide-y divide-base-200/50">
          {filteredRooms.length === 0 ? (
            <div className="py-8 text-center text-base-content/50">
              {t('rooms.noRoomsFoundMatching', { query: search })}
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div key={room.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <Box size={18} />
                  </div>
                  <div>
                    <span className="font-medium text-base-content block">{localizeRoomName(room.name, t)}</span>
                    <span className="text-xs text-base-content/45">
                      {t('rooms.appliancesCountShort', { count: room.summary.applianceCount })} · {formatBaht(room.summary.monthlyCost)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => openEdit(room)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => openDelete(room)}
                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Room Dialog */}
        <Dialog 
          isOpen={isAddOpen} 
          onClose={() => setIsAddOpen(false)} 
          title={t('rooms.addRoom')}
        >
        <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input 
            label={t('rooms.roomName')} 
            placeholder={t('rooms.roomNamePlaceholder')} 
            value={roomNameInput}
            onChange={(e) => setRoomNameInput(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!roomNameInput.trim()}>
              {t('rooms.addRoom')}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Room Dialog */}
        <Dialog 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          title={t('rooms.editRoom')}
        >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 p-6 pt-4">
          <Input 
            label={t('rooms.roomName')} 
            placeholder={t('rooms.roomNamePlaceholder')} 
            value={roomNameInput}
            onChange={(e) => setRoomNameInput(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={!roomNameInput.trim()}>
              {t('common.saveChanges')}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
        <Dialog 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          title={t('rooms.deleteRoom')}
        >
        <div className="flex flex-col gap-4 p-6 pt-4">
          <p className="text-base-content/80 text-sm">
            {t('rooms.deleteRoomConfirm', { name: currentRoom ? localizeRoomName(currentRoom.name, t) : '' })}
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="button" 
              className="btn btn-error text-error-content font-semibold px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95" 
              onClick={handleDeleteSubmit}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </Dialog>

      </div>
    </main>
  );
}
