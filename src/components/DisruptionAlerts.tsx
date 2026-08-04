import React, { useState } from 'react';
import { Disruption, TransportType } from '../types';
import { AlertTriangle, Info, BellRing, Plus, Calendar, X, ShieldAlert, Check } from 'lucide-react';

interface DisruptionAlertsProps {
  disruptions: Disruption[];
  onAddDisruption: (disruption: Disruption) => void;
  stations: { id: string; name: string }[];
}

export default function DisruptionAlerts({
  disruptions,
  onAddDisruption,
  stations,
}: DisruptionAlertsProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterType, setFilterType] = useState<TransportType | 'all'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransportType>('metro');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/perturbations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          severity,
        }),
      });

      if (response.ok) {
        const newDisrupt = await response.json();
        onAddDisruption(newDisrupt);
        setSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setSuccess(false);
          setTitle('');
          setDescription('');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to report incident:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDisruptions = filterType === 'all'
    ? disruptions
    : disruptions.filter(d => d.type === filterType);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <BellRing className="w-5 h-5 text-amber-500 animate-swing" />
          Perturbations et Alertes
        </h3>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Signaler un incident
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-50 p-1 rounded-xl overflow-x-auto">
        {(['all', 'metro', 'tram', 'train', 'bus', 'bus_priv', 'telepherique'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filterType === t
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t === 'all' ? 'Tous' : t === 'bus_priv' ? 'Bus Privé' : t === 'telepherique' ? 'Téléphérique' : t}
          </button>
        ))}
      </div>

      {/* Disruption Cards */}
      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {filteredDisruptions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Aucun incident signalé sur ce réseau. Trafic fluide.
          </div>
        ) : (
          filteredDisruptions.map((d) => {
            const severityColor =
              d.severity === 'critical'
                ? 'bg-rose-50 border-rose-100 text-rose-800'
                : d.severity === 'warning'
                ? 'bg-amber-50 border-amber-100 text-amber-800'
                : 'bg-blue-50 border-blue-100 text-blue-800';

            const badgeColor =
              d.type === 'metro'
                ? 'bg-rose-500'
                : d.type === 'tram'
                ? 'bg-blue-500'
                : d.type === 'train'
                ? 'bg-emerald-500'
                : d.type === 'bus_priv'
                ? 'bg-cyan-500'
                : 'bg-amber-500';

            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border flex gap-3 ${severityColor} animate-fade-in`}
              >
                {d.severity === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                ) : d.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-800 text-sm">{d.title}</span>
                    <span className="text-[9px] text-white px-1.5 py-0.5 rounded-md font-bold uppercase" style={{ backgroundColor: d.type === 'all' ? '#64748B' : badgeColor }}>
                      {d.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {d.description}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Report incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[2500]">
          <div className="bg-white p-5 rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Signaler une anomalie d'Alger
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-600 space-y-2">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold">Signalement Enregistré !</h4>
                <p className="text-xs text-slate-500">
                  Merci, votre alerte a été ajoutée en direct sur le flux citoyen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Nature du problème / Titre
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Ralentissement ligne de métro, Panne escalator"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Réseau Concerné
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransportType)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="metro">Métro d'Alger</option>
                    <option value="tram">Tramway d'Alger</option>
                    <option value="train">Train de Banlieue SNTF</option>
                    <option value="bus">Réseau Bus ETUSA</option>
                    <option value="bus_priv">Bus Privé</option>
                    <option value="telepherique">Téléphérique / Télécabine</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Gravité / Sévérité
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'info', label: 'ℹ️ Info', color: 'hover:bg-blue-50 border-blue-200 text-blue-600' },
                      { id: 'warning', label: '⚠️ Retard', color: 'hover:bg-amber-50 border-amber-200 text-amber-600' },
                      { id: 'critical', label: '🚨 Interruption', color: 'hover:bg-rose-50 border-rose-200 text-rose-600' },
                    ] as const).map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSeverity(s.id)}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${s.color} ${
                          severity === s.id
                            ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-900'
                            : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Description de l'incident
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Précisez la station et l'impact estimé pour les voyageurs..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-md flex items-center gap-1"
                  >
                    {isLoading ? 'Envoi...' : 'Publier'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
