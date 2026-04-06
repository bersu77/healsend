"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";

const LOCATIONS = [
  { value: "header", label: "Header Navigation" },
  { value: "footer", label: "Footer Navigation" },
  { value: "mobile", label: "Mobile Menu" },
  { value: "custom", label: "Custom (no location)" },
];

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

const selectCls =
  "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

// ─── Helper: build a flat ordered list with nesting metadata ─────────────────
function buildDisplayList(items) {
  const topLevel = items
    .filter((i) => !i.parentId)
    .sort((a, b) => a.order - b.order);

  const result = [];
  for (const parent of topLevel) {
    result.push({ ...parent, depth: 0 });
    const children = items
      .filter((i) => i.parentId === parent.id)
      .sort((a, b) => a.order - b.order);
    for (const child of children) {
      result.push({ ...child, depth: 1 });
    }
  }
  return result;
}

export default function NavigationPage() {
  const { notify } = useNotifications();

  // ── Menus list ────────────────────────────────────────────────────────────
  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  // ── Create menu form ──────────────────────────────────────────────────────
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuLoc, setNewMenuLoc] = useState("header");
  const [creatingMenu, setCreatingMenu] = useState(false);

  // ── Selected menu state ────────────────────────────────────────────────────
  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]); // flat, display-ordered
  const [loadingMenu, setLoadingMenu] = useState(false);

  // ── Edit menu name / location ─────────────────────────────────────────────
  const [editingMenuMeta, setEditingMenuMeta] = useState(false);
  const [metaName, setMetaName] = useState("");
  const [metaLoc, setMetaLoc] = useState("header");

  // ── Add item form ─────────────────────────────────────────────────────────
  const [addForm, setAddForm] = useState({
    label: "",
    url: "",
    target: "",
    parentId: "",
  });
  const [addingItem, setAddingItem] = useState(false);

  // ── Inline item editing ───────────────────────────────────────────────────
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({
    label: "",
    url: "",
    target: "",
    parentId: "",
  });

  // ── Load menus list ───────────────────────────────────────────────────────
  const loadMenus = useCallback(async () => {
    const res = await fetch("/api/admin/navigation");
    if (res.ok) {
      const data = await res.json();
      setMenus(data.menus || []);
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  // ── Load a specific menu ──────────────────────────────────────────────────
  const loadMenu = useCallback(async (id) => {
    setLoadingMenu(true);
    setEditingItemId(null);
    const res = await fetch(`/api/admin/navigation/${id}`);
    if (res.ok) {
      const data = await res.json();
      setMenu(data);
      setMetaName(data.name);
      setMetaLoc(data.location);
      setItems(buildDisplayList(data.items || []));
    }
    setLoadingMenu(false);
  }, []);

  useEffect(() => {
    if (selectedMenuId) loadMenu(selectedMenuId);
    else {
      setMenu(null);
      setItems([]);
    }
  }, [selectedMenuId, loadMenu]);

  // ── Create menu ────────────────────────────────────────────────────────────
  const handleCreateMenu = async () => {
    if (!newMenuName.trim()) return;
    setCreatingMenu(true);
    const res = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMenuName.trim(), location: newMenuLoc }),
    });
    if (res.ok) {
      const created = await res.json();
      notify.success("Menu Created", `"${created.name}" has been created.`);
      setNewMenuName("");
      await loadMenus();
      setSelectedMenuId(created.id);
    } else {
      notify.error("Error", "Failed to create menu.");
    }
    setCreatingMenu(false);
  };

  // ── Delete menu ────────────────────────────────────────────────────────────
  const handleDeleteMenu = async (id) => {
    if (!confirm("Delete this menu and all its items?")) return;
    const res = await fetch(`/api/admin/navigation/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notify.success("Deleted", "Menu has been removed.");
      if (selectedMenuId === id) setSelectedMenuId(null);
      loadMenus();
    } else {
      notify.error("Error", "Failed to delete menu.");
    }
  };

  // ── Save menu meta ─────────────────────────────────────────────────────────
  const handleSaveMeta = async () => {
    const res = await fetch(`/api/admin/navigation/${selectedMenuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: metaName, location: metaLoc }),
    });
    if (res.ok) {
      notify.success("Saved", "Menu settings updated.");
      setEditingMenuMeta(false);
      await loadMenus();
      loadMenu(selectedMenuId);
    } else {
      notify.error("Error", "Failed to save menu settings.");
    }
  };

  // ── Add item ───────────────────────────────────────────────────────────────
  const handleAddItem = async () => {
    if (!addForm.label.trim() || !addForm.url.trim()) return;
    setAddingItem(true);
    const res = await fetch(`/api/admin/navigation/${selectedMenuId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: addForm.label,
        url: addForm.url,
        target: addForm.target || null,
        parentId: addForm.parentId || null,
      }),
    });
    if (res.ok) {
      notify.success("Item Added", `"${addForm.label}" added to menu.`);
      setAddForm({ label: "", url: "", target: "", parentId: "" });
      loadMenu(selectedMenuId);
    } else {
      notify.error("Error", "Failed to add item.");
    }
    setAddingItem(false);
  };

  // ── Edit item ──────────────────────────────────────────────────────────────
  const openEditItem = (item) => {
    setEditingItemId(item.id);
    setEditForm({
      label: item.label,
      url: item.url,
      target: item.target || "",
      parentId: item.parentId || "",
    });
  };

  const handleSaveItem = async (itemId) => {
    const res = await fetch(
      `/api/admin/navigation/${selectedMenuId}/items/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: editForm.label,
          url: editForm.url,
          target: editForm.target || null,
          parentId: editForm.parentId || null,
        }),
      },
    );
    if (res.ok) {
      notify.success("Saved", "Navigation item updated.");
      setEditingItemId(null);
      loadMenu(selectedMenuId);
    } else {
      notify.error("Error", "Failed to save item.");
    }
  };

  // ── Delete item ────────────────────────────────────────────────────────────
  const handleDeleteItem = async (itemId) => {
    if (!confirm("Remove this item from the menu?")) return;
    const res = await fetch(
      `/api/admin/navigation/${selectedMenuId}/items/${itemId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      notify.success("Removed", "Navigation item removed.");
      loadMenu(selectedMenuId);
    } else {
      notify.error("Error", "Failed to remove item.");
    }
  };

  // ── Drag-and-drop reorder ──────────────────────────────────────────────────
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // Re-assign order values based on new positions, keeping depth/parentId intact
    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setItems(updated);

    // Persist
    await fetch(`/api/admin/navigation/${selectedMenuId}/items`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: updated.map(({ id, order, parentId }) => ({
          id,
          order,
          parentId,
        })),
      }),
    });
  };

  const locationLabel = (loc) =>
    LOCATIONS.find((l) => l.value === loc)?.label || loc;

  // Top-level items for the "parent" dropdown in the Add form
  const topLevelItems = items.filter((i) => i.depth === 0);

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">
            Navigation
          </h1>
          <p className="text-sm text-[#484555] mt-0.5">
            Create and manage menus, then assign them to site locations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        {/* ── Left panel: menus list + create ── */}
        <div className="space-y-4">
          {/* Create new menu */}
          <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-5 space-y-3">
            <h3 className="font-semibold text-sm text-[#1c1a24]">
              Create New Menu
            </h3>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                Menu Name
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Main Navigation"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateMenu()}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                Location
              </label>
              <select
                className={selectCls}
                value={newMenuLoc}
                onChange={(e) => setNewMenuLoc(e.target.value)}
              >
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleCreateMenu}
              disabled={creatingMenu || !newMenuName.trim()}
              className="hs-gradient-btn w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <AppIcon name="add" className="h-[18px] w-[18px]" />
              Create Menu
            </button>
          </div>

          {/* Existing menus */}
          {menus.length > 0 && (
            <div className="bg-white rounded-xl border border-[#c9c4d8]/20 overflow-hidden">
              <div className="px-5 py-3 border-b border-[#c9c4d8]/20">
                <h3 className="font-semibold text-sm text-[#1c1a24]">
                  Your Menus
                </h3>
              </div>
              <ul className="divide-y divide-[#c9c4d8]/10">
                {menus.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => setSelectedMenuId(m.id)}
                      className={`w-full text-left px-5 py-3 flex items-center justify-between gap-2 transition-colors hover:bg-[#f7f5ff] ${
                        selectedMenuId === m.id
                          ? "bg-[#e5deff] text-[#5b3cdd]"
                          : "text-[#1c1a24]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-[#484555] mt-0.5">
                          {locationLabel(m.location)} &middot;{" "}
                          {m._count?.items ?? 0} item
                          {(m._count?.items ?? 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMenu(m.id);
                        }}
                        className="flex-shrink-0 text-[#c9c4d8] hover:text-red-500 transition-colors"
                        title="Delete menu"
                      >
                        <AppIcon name="delete" className="h-[18px] w-[18px]" />
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {menus.length === 0 && (
            <p className="text-sm text-[#484555] text-center py-4">
              No menus yet. Create one above.
            </p>
          )}
        </div>

        {/* ── Right panel: edit selected menu ── */}
        <div className="space-y-5">
          {!selectedMenuId && (
            <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-10 flex flex-col items-center justify-center text-center gap-3">
              <AppIcon name="menu_open" className="h-10 w-10 text-[#c9c4d8]" />
              <p className="text-sm text-[#484555]">
                Select a menu from the left, or create a new one to get started.
              </p>
            </div>
          )}

          {selectedMenuId && loadingMenu && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-7 h-7 border-2 border-[#5b3cdd] border-t-transparent rounded-full" />
            </div>
          )}

          {selectedMenuId && !loadingMenu && menu && (
            <>
              {/* Menu settings */}
              <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1c1a24]">
                    Menu Settings
                  </h3>
                  {!editingMenuMeta && (
                    <button
                      onClick={() => setEditingMenuMeta(true)}
                      className="text-xs text-[#5b3cdd] hover:underline flex items-center gap-1"
                    >
                      <AppIcon name="edit" className="h-[14px] w-[14px]" />
                      Edit
                    </button>
                  )}
                </div>

                {!editingMenuMeta ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs font-semibold text-[#484555] uppercase mb-0.5">
                        Name
                      </dt>
                      <dd className="text-[#1c1a24] font-medium">
                        {menu.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold text-[#484555] uppercase mb-0.5">
                        Location
                      </dt>
                      <dd className="text-[#1c1a24] font-medium">
                        {locationLabel(menu.location)}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                          Name
                        </label>
                        <input
                          className={inputCls}
                          value={metaName}
                          onChange={(e) => setMetaName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                          Location
                        </label>
                        <select
                          className={selectCls}
                          value={metaLoc}
                          onChange={(e) => setMetaLoc(e.target.value)}
                        >
                          {LOCATIONS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveMeta}
                        className="hs-gradient-btn px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingMenuMeta(false)}
                        className="px-4 py-2 rounded-lg text-sm border border-[#c9c4d8]/30 text-[#484555] hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu structure (drag & drop) */}
              <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1c1a24]">
                    Menu Structure
                  </h3>
                  <span className="text-xs text-[#484555]">
                    Drag items to reorder
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="text-sm text-[#484555] py-4 text-center">
                    No items yet. Add one below.
                  </p>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="nav-items">
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-1"
                        >
                          {items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(drag, snapshot) => (
                                <li
                                  ref={drag.innerRef}
                                  {...drag.draggableProps}
                                  className={`rounded-lg border transition-shadow ${
                                    snapshot.isDragging
                                      ? "border-[#5b3cdd] shadow-lg"
                                      : "border-[#c9c4d8]/20"
                                  } ${item.depth === 1 ? "ml-8" : ""}`}
                                >
                                  {editingItemId === item.id ? (
                                    /* ── Inline edit form ── */
                                    <div className="p-4 space-y-3 bg-[#f7f5ff] rounded-lg">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                                            Navigation Label
                                          </label>
                                          <input
                                            className={inputCls}
                                            value={editForm.label}
                                            onChange={(e) =>
                                              setEditForm((f) => ({
                                                ...f,
                                                label: e.target.value,
                                              }))
                                            }
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                                            URL
                                          </label>
                                          <input
                                            className={inputCls}
                                            value={editForm.url}
                                            onChange={(e) =>
                                              setEditForm((f) => ({
                                                ...f,
                                                url: e.target.value,
                                              }))
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                                            Parent Item
                                          </label>
                                          <select
                                            className={selectCls}
                                            value={editForm.parentId}
                                            onChange={(e) =>
                                              setEditForm((f) => ({
                                                ...f,
                                                parentId: e.target.value,
                                              }))
                                            }
                                          >
                                            <option value="">
                                              — None (top level) —
                                            </option>
                                            {topLevelItems
                                              .filter((t) => t.id !== item.id)
                                              .map((t) => (
                                                <option key={t.id} value={t.id}>
                                                  {t.label}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                        <div className="flex items-end">
                                          <label className="flex items-center gap-2 text-sm text-[#484555] cursor-pointer pb-1">
                                            <input
                                              type="checkbox"
                                              checked={
                                                editForm.target === "_blank"
                                              }
                                              onChange={(e) =>
                                                setEditForm((f) => ({
                                                  ...f,
                                                  target: e.target.checked
                                                    ? "_blank"
                                                    : "",
                                                }))
                                              }
                                              className="rounded border-[#c9c4d8]"
                                            />
                                            Open in new tab
                                          </label>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() =>
                                            handleSaveItem(item.id)
                                          }
                                          className="hs-gradient-btn px-4 py-2 rounded-lg text-sm font-semibold"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingItemId(null)}
                                          className="px-4 py-2 rounded-lg text-sm border border-[#c9c4d8]/30 text-[#484555] hover:bg-white"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* ── Item row ── */
                                    <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-lg">
                                      <span
                                        {...drag.dragHandleProps}
                                        className="text-[#c9c4d8] hover:text-[#5b3cdd] cursor-grab flex-shrink-0"
                                        title="Drag to reorder"
                                      >
                                        <AppIcon
                                          name="drag_indicator"
                                          className="h-[18px] w-[18px]"
                                        />
                                      </span>

                                      {item.depth === 1 && (
                                        <AppIcon
                                          name="subdirectory_arrow_right"
                                          className="h-[16px] w-[16px] text-[#c9c4d8] flex-shrink-0"
                                        />
                                      )}

                                      <div className="flex-1 min-w-0">
                                        <span className="text-sm font-medium text-[#1c1a24]">
                                          {item.label}
                                        </span>
                                        <span className="text-xs text-[#484555] ml-2 truncate">
                                          {item.url}
                                        </span>
                                        {item.target === "_blank" && (
                                          <span className="ml-2 text-[10px] bg-[#e5deff] text-[#5b3cdd] px-1.5 py-0.5 rounded font-medium">
                                            new tab
                                          </span>
                                        )}
                                      </div>

                                      <button
                                        onClick={() => openEditItem(item)}
                                        className="flex-shrink-0 text-[#c9c4d8] hover:text-[#5b3cdd] transition-colors"
                                        title="Edit"
                                      >
                                        <AppIcon
                                          name="edit"
                                          className="h-[16px] w-[16px]"
                                        />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteItem(item.id)
                                        }
                                        className="flex-shrink-0 text-[#c9c4d8] hover:text-red-500 transition-colors"
                                        title="Remove"
                                      >
                                        <AppIcon
                                          name="close"
                                          className="h-[16px] w-[16px]"
                                        />
                                      </button>
                                    </div>
                                  )}
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>

              {/* Add menu items */}
              <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-5 space-y-4">
                <h3 className="font-semibold text-[#1c1a24]">Add Menu Item</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                      Navigation Label
                    </label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Weight Loss"
                      value={addForm.label}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, label: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                      URL
                    </label>
                    <input
                      className={inputCls}
                      placeholder="e.g. /weight-loss or https://..."
                      value={addForm.url}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, url: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#484555] uppercase block mb-1">
                      Parent Item{" "}
                      <span className="font-normal">(optional)</span>
                    </label>
                    <select
                      className={selectCls}
                      value={addForm.parentId}
                      onChange={(e) =>
                        setAddForm((f) => ({ ...f, parentId: e.target.value }))
                      }
                    >
                      <option value="">— None (top level) —</option>
                      {topLevelItems.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 text-sm text-[#484555] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addForm.target === "_blank"}
                        onChange={(e) =>
                          setAddForm((f) => ({
                            ...f,
                            target: e.target.checked ? "_blank" : "",
                          }))
                        }
                        className="rounded border-[#c9c4d8]"
                      />
                      Open in new tab
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleAddItem}
                  disabled={
                    addingItem || !addForm.label.trim() || !addForm.url.trim()
                  }
                  className="hs-gradient-btn px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <AppIcon name="add" className="h-[18px] w-[18px]" />
                  Add to Menu
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
