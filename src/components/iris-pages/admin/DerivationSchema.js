import DistrictDerivation from '~/components/iris-pages/admin/DistrictDerivation.vue'
import ProfileDerivation from '~/components/iris-pages/admin/ProfileDerivation.vue'
import PolygonDerivation from '~/components/iris-pages/admin/PolygonDerivation.vue'
import DerivationFieldset from './DerivationFieldset'

export default {
  fields: {
    district_derivations: {
      title: 'Descentralitzada',
      uid: 'district_derivations',
      component: DistrictDerivation,
      required: true,
      styleClasses: 'col-12',
      // hideGroupErrors: true,
    },
    direct_derivations: {
      title: 'Directa',
      uid: 'direct_derivations',
      component: ProfileDerivation,
      styleClasses: 'col-12',
    },
    polygon_derivations: {
      title: 'Centralizada',
      uid: 'polygon_derivations',
      component: PolygonDerivation,
      styleClasses: 'col-12',
      sync: false,
    },
  },
  groups: [
    {
      class: 'derivations-module mb-3',
      groups: [
        {
          legend: 'Derivacions',
          layout_name: 'derivations',
          component: DerivationFieldset,
          emptyValue: [],
          fields: ['direct_derivations', 'district_derivations'],
          class: 'col-12 module',
        },
      ],
    },
  ],
}
