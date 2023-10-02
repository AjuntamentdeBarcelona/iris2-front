// Instància
// GLOBAL PROCESS
$nuxt.$axios.post('/api/post-migrate/?set-rchannel-none=1')

$nuxt.$axios.post('/api/post-migrate/')

$nuxt.$axios.patch('api/masters/supports/4/', { register_required: true })
// INSTÀNCIA AMB SIGNATURES
$nuxt.$axios.patch('api/masters/supports/17/', { register_required: true })
// INSTÀNCIA TELEMÀTICA
$nuxt.$axios.patch('api/masters/supports/30/', { register_required: true })
// MITJANS DE COMUNICACIÓ
$nuxt.$axios.patch('api/masters/supports/8/', {
  communication_media_required: true,
})

// Canals d'entrada
$nuxt.$axios.patch('api/masters/input_channels/13/', { can_be_mayorship: true })
// Set mayorship false
Array(100)
  .fill()
  .forEach(function(_, i) {
    $nuxt.$axios.patch('api/masters/input_channels/' + i + '/', {
      can_be_mayorship: false,
    })
  })
$nuxt.$axios.patch('api/masters/input_channels/13/', { can_be_mayorship: true })

// Set DAIR as ambit

// Feature Codenames

$nuxt.$axios.patch('api/features/features/1022/', {
  codename_iris: 'idtramit',
  mask_id: 1,
})
$nuxt.$axios.patch('api/features/features/530/', {
  codename_iris: 'nomtramit',
  mask_id: 1,
})

// DAIR IS AMBIT
$nuxt.$axios.patch('api/profiles/groups/262144/', {
  is_ambit: true,
})
