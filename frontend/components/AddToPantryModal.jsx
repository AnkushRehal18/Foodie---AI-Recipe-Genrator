/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageUploader from "@/components/ImageUploader";
import useFetch from "@/hooks/useFetch";
import {
  scanPantryImage,
  saveToPantry,
  addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";

export default function AddToPantryModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

  // Scan image
  const {
    loading: scanning,
    data: scanData,
    fn: scanImage,
  } = useFetch(scanPantryImage);

  // Save scanned items
  const {
    loading: saving,
    data: saveData,
    fn: saveScannedItems,
  } = useFetch(saveToPantry);

  // Add manual item
  const {
    loading: adding,
    data: addData,
    fn: addManualItem,
  } = useFetch(addPantryItemManually);

  // Handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]); // Reset when new image selected
  };

  // Scan image
  const handleScan = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    await scanImage(formData);
  };

  // Update scanned ingredients when scan completes
  useEffect(() => {
    if (scanData?.success && scanData?.ingredients) {
      setScannedIngredients(scanData.ingredients);
      toast.success(`Found ${scanData.ingredients.length} ingredients!`);
    }
  }, [scanData]);

  // Handle save scanned items
  const handleSaveScanned = async () => {
    if (scannedIngredients.length === 0) {
      toast.error("No ingredients to save");
      return;
    }

    const formData = new FormData();
    formData.append("ingredients", JSON.stringify(scannedIngredients));
    await saveScannedItems(formData);
  };

  // Reset modal state
  const handleClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setManualItem({ name: "", quantity: "" });
    onClose();
  };

  // Handle save success
  useEffect(() => {
    if (saveData?.success) {
      toast.success(saveData.message);
      handleClose();
      if (onSuccess) onSuccess();
    }
  }, [saveData]);

  // Handle manual add
  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", manualItem.name);
    formData.append("quantity", manualItem.quantity);
    await addManualItem(formData);
  };

  // Handle manual add success
  useEffect(() => {
    if (addData?.success) {
      toast.success("Item added to pantry!");
      setManualItem({ name: "", quantity: "" });
      handleClose();
      if (onSuccess) onSuccess();
    }
  }, [addData]);

  // Remove scanned ingredient
  const removeIngredient = (index) => {
    setScannedIngredients(scannedIngredients.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold tracking-tight text-stone-900">
            Add to Pantry
          </DialogTitle>
          <DialogDescription className="text-stone-500 text-sm">
            Scan your pantry with AI or add items manually
          </DialogDescription>
        </DialogHeader>

        {/* Tab switcher — full width, horizontal, on top */}
        <div className="flex w-full bg-stone-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "scan"
                ? "bg-white shadow-sm text-stone-900"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Camera className="w-4 h-4" />
            AI Scan
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "manual"
                ? "bg-white shadow-sm text-stone-900"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>

        {/* AI Scan Tab */}
        {activeTab === "scan" && (
          <div className="flex flex-col gap-4">
            {scannedIngredients.length === 0 ? (
              <>
                {/* Tip */}
                {!selectedImage && (
                  <p className="text-xs text-stone-400 text-center">
                    💡 Point your camera at your fridge or pantry shelf for best results
                  </p>
                )}

                {/* Scan button — appears after image selected */}
                {selectedImage && !scanning && (
                  <Button
                    onClick={handleScan}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11 font-semibold rounded-xl"
                    disabled={scanning}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan with AI
                  </Button>
                )}

                {/* Drop zone — always below */}
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  loading={scanning}
                />
              </>
            ) : (
              /* Step 2: Review & Save */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Review Detected Items
                    </h3>
                    <p className="text-xs text-stone-500">
                      Found {scannedIngredients.length} ingredients
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScannedIngredients([]);
                      setSelectedImage(null);
                    }}
                    className="gap-1.5 text-xs h-8 border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-700"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Scan Again
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {scannedIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 text-sm truncate">
                          {ingredient.name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {ingredient.quantity}
                        </div>
                      </div>
                      {ingredient.confidence && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-700 border-green-200 bg-green-50 shrink-0"
                        >
                          {Math.round(ingredient.confidence * 100)}%
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeIngredient(index)}
                        className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-1.5 h-auto shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSaveScanned}
                  disabled={saving || scannedIngredients.length === 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11 font-semibold rounded-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save {scannedIngredients.length} Items to Pantry
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Manual Add Tab */}
        {activeTab === "manual" && (
          <form onSubmit={handleAddManual} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Ingredient Name
              </label>
              <input
                type="text"
                value={manualItem.name}
                onChange={(e) =>
                  setManualItem({ ...manualItem, name: e.target.value })
                }
                placeholder="e.g., Chicken breast"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                disabled={adding}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Quantity
              </label>
              <input
                type="text"
                value={manualItem.quantity}
                onChange={(e) =>
                  setManualItem({ ...manualItem, quantity: e.target.value })
                }
                placeholder="e.g., 500g, 2 cups, 3 pieces"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                disabled={adding}
              />
            </div>

            <Button
              type="submit"
              disabled={adding}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11 font-semibold rounded-xl"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
