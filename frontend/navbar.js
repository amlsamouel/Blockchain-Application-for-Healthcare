$('#navbar').html(
    `
    <div class="flex-shrink-0 h-100 p-3" style="width: 250px; background: #0f0c29; background: linear-gradient(to right, #0f0c29, #302b63, #24243e);">
        <a href="index.html" class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
            <h2 class="my-2" style="color: #77C5CA;"><i class="fas fa-plus-square" aria-hidden="true"></i> Healthcare</h2>
        </a>
        <ul class="list-unstyled ps-0">
            <li class="mb-1">
                <a href="index.html" class="btn btn-toggle align-items-center rounded">
                    <i class="fa-solid fa-layer-group"></i>&nbsp; Dashboard
                </a>
            </li>

            <li class="mb-1">
                <button class="btn btn-toggle align-items-center rounded collapsed d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#patients_collapse" aria-expanded="false">
                    <i class="fa-solid fa-hospital-user"></i>&nbsp; Patients
                </button>
                <div class="collapse" id="patients_collapse">
                <ul class="row gap-2 btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="add-patient.html" class="link-light rounded">Add Patient</a></li>
                    <li><a href="edit-patient.html" class="link-light rounded">Edit Patient</a></li>
                </ul>
                </div>
            </li>

            <li class="mb-1">
                <button class="btn btn-toggle align-items-center rounded collapsed d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#doctors_collapse" aria-expanded="false">
                    <i class="fa-solid fa-user-doctor"></i>&nbsp; Doctors
                </button>
                <div class="collapse" id="doctors_collapse">
                <ul class="row gap-2 btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="add-doctor.html" class="link-light rounded">Add Doctor</a></li>
                    <li><a href="edit-doctor.html" class="link-light rounded">Edit Doctor</a></li>
                </ul>
                </div>
            </li>

            <li class="mb-1">
                <button class="btn btn-toggle align-items-center rounded collapsed d-flex align-items-center" data-bs-toggle="collapse" data-bs-target="#drugs_collapse" aria-expanded="false">
                    <i class="fa-solid fa-pills"></i>&nbsp; Drugs
                </button>
                <div class="collapse" id="drugs_collapse">
                <ul class="row gap-2 btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="add-drug.html" class="link-light rounded">Add Drug</a></li>
                    <li><a href="edit-drug.html" class="link-light rounded">Edit Drug</a></li>
                </ul>
                </div>
            </li>

            <li class="border-top my-3"></li>

            <li class="mb-1">
                <button class="btn btn-toggle align-items-center rounded w-auto">
                    <i class='fas fa-chart-pie' style="color: #77C5CA;"></i>&nbsp; Help and Support
                </button>
            </li>

            <li class="mb-1">
                <button class="btn btn-toggle align-items-center rounded w-auto">
                    <i class='far fa-chart-bar'style="color: #77C5CA;"></i>&nbsp; Preferences
                </button>
            </li>
        </ul>
    </div>
    `
);