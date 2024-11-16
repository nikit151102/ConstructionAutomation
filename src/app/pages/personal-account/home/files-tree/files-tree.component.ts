import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { PersonalAccountService } from '../../personal-account.service';
import { TreeModule } from 'primeng/tree';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-files-tree',
  standalone: true,
  imports: [CommonModule, TreeModule],
  templateUrl: './files-tree.component.html',
  styleUrl: './files-tree.component.scss'
})
export class FilesTreeComponent {
  files: TreeNode[] = [
    {
      label: 'folder 1',
      data: { date: '2024-11-15', isFolder: true },
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: [
        {
          label: 'file 1-1',
          data: { date: '2024-11-14', isFolder: false },
          icon: 'pi pi-file',
        },
        {
          label: 'file 1-2',
          data: { date: '2024-11-13', isFolder: false },
          icon: 'pi pi-file',
        },
      ],
    },
    {
      label: 'folder 2',
      data: { date: '2024-11-14', isFolder: true },
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      children: [
        {
          label: 'file 2-1',
          data: { date: '2024-11-13', isFolder: false },
          icon: 'pi pi-file',
        },
      ],
    },
    {
      label: 'file 3',
      data: { date: '2024-11-13', isFolder: false },
      icon: 'pi pi-file',
    },
  ];

  breadcrumbs = [{ label: 'Хранилище' }];
  currentFiles: TreeNode[] = this.files;

  constructor() {
  }

  onNodeSelect(event: any) {
    const node = event.node;
    if (node.data.isFolder) {
      this.openFolder(node);
    } else {
      console.log(`Открытие файла: ${node.label}`);
    }
  }

  openFolder(folder: TreeNode) {
    if(folder.label)
    this.breadcrumbs.push({ label: folder.label });
    this.currentFiles = folder.children || [];
  }

  goToBreadcrumb(index: number) {
    if (index < this.breadcrumbs.length - 1) {
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      this.currentFiles = this.getFilesByBreadcrumbs();
    }
  }

  getFilesByBreadcrumbs(): TreeNode[] {
    let files = this.files;
    for (const breadcrumb of this.breadcrumbs.slice(1)) {
      const folder = files.find(
        (file) => file.label === breadcrumb.label && file.data.isFolder
      );
      if (folder) {
        files = folder.children || [];
      }
    }
    return files;
  }
}