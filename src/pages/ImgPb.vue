<script setup lang="ts">
//src/components/ImgPb.vue
import { pb } from "@/backend";
const props = defineProps<{
  /** L'enregistrement 'complet' (id et collectionId ou collectionName) de PocketBase */
  record: {
    id: string;
  } & (
    | {
        collectionId: string;
      }
    | {
        collectionName: string;
      }
  );
  /** La valeur du nom de fichier stocké dans la colonne de PocketBase */
  filename: string;
  /** La largeur aussi utilisée pour fixer la largeur d'image demandée à PocketBase */
  width?: number | string;
  /** La hauteur aussi utilisée pour fixer la hauteur d'image demandée à PocketBase */
  height?: number | string;
  /** Pour fixer manuellement les paramétres de redimensitionnement de PocketBase \
   * https://pocketbase.io/docs/files-handling/#file-url
   */
  thumb?: string;
}>();
const src = pb.files.getUrl(props.record, props.filename, {
  thumb: props.thumb || `${props.width ?? 0}x${props.height ?? 0}`,
});
</script>
<template>
  <img :src="src" :width="width" :height="height" />
</template>
