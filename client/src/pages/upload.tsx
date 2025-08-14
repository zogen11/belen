import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Video, Clock, Camera, X } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertVideoSchema, insertShortsSchema, insertPhotoSchema } from "@shared/schema";
import { z } from "zod";

type UploadType = "video" | "shorts" | "photo";

const uploadFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  isMonetized: z.boolean().default(true),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

export default function Upload() {
  const [selectedType, setSelectedType] = useState<UploadType>("video");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      isMonetized: true,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFormData & { file: File; type: UploadType }) => {
      // Mock file upload - in a real app, you'd upload to a file storage service
      const mockUrl = URL.createObjectURL(data.file);
      
      const basePayload = {
        userId: "mock-user-id", // In a real app, this would come from auth
        title: data.title,
        description: data.description || "",
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        isMonetized: data.isMonetized,
      };

      if (data.type === "video") {
        return apiRequest("POST", "/api/videos", {
          ...basePayload,
          thumbnailUrl: mockUrl,
          videoUrl: mockUrl,
          duration: 300, // Mock 5 minutes
        });
      } else if (data.type === "shorts") {
        return apiRequest("POST", "/api/shorts", {
          ...basePayload,
          thumbnailUrl: mockUrl,
          videoUrl: mockUrl,
          duration: 45, // Mock 45 seconds
        });
      } else {
        return apiRequest("POST", "/api/photos", {
          ...basePayload,
          imageUrl: mockUrl,
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: `Your ${selectedType} has been uploaded successfully!`,
      });
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = (data: UploadFormData) => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      ...data,
      file: selectedFile,
      type: selectedType,
    });
  };

  const uploadTypes = [
    {
      type: "video" as const,
      icon: Video,
      label: "Video",
      description: "MP4, MOV, AVI",
      accept: "video/*",
      bgColor: "border-red-300 hover:border-red-400",
    },
    {
      type: "shorts" as const,
      icon: Clock,
      label: "Short",
      description: "60s max",
      accept: "video/*",
      bgColor: "border-purple-300 hover:border-purple-400",
    },
    {
      type: "photo" as const,
      icon: Camera,
      label: "Photo",
      description: "JPG, PNG",
      accept: "image/*",
      bgColor: "border-blue-300 hover:border-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Upload Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Type Selection */}
            <div className="grid grid-cols-3 gap-4">
              {uploadTypes.map((uploadType) => {
                const Icon = uploadType.icon;
                return (
                  <button
                    key={uploadType.type}
                    onClick={() => setSelectedType(uploadType.type)}
                    className={`flex flex-col items-center space-y-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                      selectedType === uploadType.type
                        ? "border-belen-orange bg-orange-50"
                        : uploadType.bgColor
                    }`}
                  >
                    <Icon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm font-medium">{uploadType.label}</span>
                    <span className="text-xs text-gray-500">{uploadType.description}</span>
                  </button>
                );
              })}
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg font-medium text-gray-700">{selectedFile.name}</span>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-500">File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  {/* Preview */}
                  <div className="mt-4">
                    {selectedType === "photo" && (
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="max-h-32 mx-auto rounded-lg"
                      />
                    )}
                    {(selectedType === "video" || selectedType === "shorts") && (
                      <video 
                        src={URL.createObjectURL(selectedFile)} 
                        className="max-h-32 mx-auto rounded-lg"
                        controls
                      />
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <CloudUpload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Choose your {selectedType} file</p>
                  <p className="text-gray-500 mb-4">Select from your device gallery or files</p>
                  <div className="space-y-3">
                    <label htmlFor="file-upload">
                      <Button className="bg-belen-orange text-white hover:bg-orange-600 w-full sm:w-auto">
                        📁 Browse Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept={uploadTypes.find(t => t.type === selectedType)?.accept}
                        onChange={handleFileSelect}
                      />
                    </label>
                    
                    {selectedType === "photo" && (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <label htmlFor="camera-upload">
                          <Button variant="outline" className="w-full sm:w-auto">
                            📷 Take Photo
                          </Button>
                          <input
                            id="camera-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <label htmlFor="gallery-upload">
                          <Button variant="outline" className="w-full sm:w-auto">
                            🖼️ Gallery
                          </Button>
                          <input
                            id="gallery-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                    )}
                    
                    {(selectedType === "video" || selectedType === "shorts") && (
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <label htmlFor="camera-video-upload">
                          <Button variant="outline" className="w-full sm:w-auto">
                            🎥 Record Video
                          </Button>
                          <input
                            id="camera-video-upload"
                            type="file"
                            className="hidden"
                            accept="video/*"
                            capture="environment"
                            onChange={handleFileSelect}
                          />
                        </label>
                        <label htmlFor="gallery-video-upload">
                          <Button variant="outline" className="w-full sm:w-auto">
                            📹 Video Gallery
                          </Button>
                          <input
                            id="gallery-video-upload"
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={handleFileSelect}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Upload Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter content title..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Describe your content..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tags separated by commas..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Monetization Settings */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Monetization Settings</h4>
                  <FormField
                    control={form.control}
                    name="isMonetized"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable monetization for this content</FormLabel>
                          <div className="text-sm text-gray-600">
                            <p><strong>Videos/Shorts:</strong> Earn money based on views ($0.001 per view)</p>
                            <p><strong>Photos:</strong> Earn money based on likes ($0.005 per like)</p>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-belen-orange text-white hover:bg-orange-600"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Content"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <MobileNav />
    </div>
  );
}
