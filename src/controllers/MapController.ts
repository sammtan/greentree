import { TreeModel, Tree } from '../models/TreeModel';

export class MapController {
  private model: TreeModel;

  constructor() {
    this.model = new TreeModel();
  }

  async loadTrees(): Promise<Tree[]> {
    return await this.model.fetchTrees();
  }

  async getTreeDetails(id: string): Promise<Tree | null> {
    return await this.model.getTreeById(id);
  }
}