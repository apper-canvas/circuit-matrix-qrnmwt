import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const commentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } },
          { field: { Name: "task_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.fetchRecords('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
      return [];
    }
  },

  async getByTaskId(taskId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } },
          { field: { Name: "task_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [
          {
            FieldName: "task_id",
            Operator: "EqualTo",
            Values: [parseInt(taskId, 10).toString()]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching task comments:", error);
      toast.error("Failed to load task comments");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "created_at" } },
          { field: { Name: "task_id" } },
          { field: { Name: "user_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await apperClient.getRecordById('Comment1', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching comment with ID ${id}:`, error);
      toast.error("Failed to load comment");
      return null;
    }
  },

  async create(commentData) {
    try {
      const params = {
        records: [{
          Name: commentData.Name || commentData.content?.substring(0, 50) || 'Comment',
          content: commentData.content,
          task_id: parseInt(commentData.task_id || commentData.taskId, 10),
          user_id: parseInt(commentData.user_id || commentData.userId, 10),
          Tags: commentData.Tags || "",
          created_at: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} comments:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Comment added successfully');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Failed to add comment");
      return null;
    }
  },

  async update(id, commentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id, 10),
          Name: commentData.Name || commentData.content?.substring(0, 50) || 'Comment',
          content: commentData.content,
          task_id: commentData.task_id || commentData.taskId ? parseInt(commentData.task_id || commentData.taskId, 10) : null,
          user_id: commentData.user_id || commentData.userId ? parseInt(commentData.user_id || commentData.userId, 10) : null,
          Tags: commentData.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} comments:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Comment updated successfully');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('Comment1', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} comments:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Comment deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      return false;
    }
  }
};