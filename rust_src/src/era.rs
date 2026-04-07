#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Era {
    Primitive = 0,
    Medieval = 1,
    Industrial = 2,
    Modern = 3,
    Futuristic = 4,
}

impl Era {
    pub fn from_u32(value: u32) -> Self {
        match value {
            0 => Era::Primitive,
            1 => Era::Medieval,
            2 => Era::Industrial,
            3 => Era::Modern,
            4 => Era::Futuristic,
            _ => Era::Primitive,
        }
    }

    pub fn as_u32(self) -> u32 {
        self as u32
    }

    pub fn name(&self) -> &str {
        match self {
            Era::Primitive => "Thời Nguyên Thủy",
            Era::Medieval => "Thời Trung Cổ",
            Era::Industrial => "Thời Công Nghiệp",
            Era::Modern => "Thời Hiện Đại",
            Era::Futuristic => "Thời Tương Lai",
        }
    }

    pub fn color(&self) -> &str {
        match self {
            Era::Primitive => "#8B4513",
            Era::Medieval => "#FF6B6B",
            Era::Industrial => "#FFD700",
            Era::Modern => "#00D4FF",
            Era::Futuristic => "#A020F0",
        }
    }

    pub fn level(&self) -> f32 {
        match self {
            Era::Primitive => 0.0,
            Era::Medieval => 1.0,
            Era::Industrial => 2.0,
            Era::Modern => 3.0,
            Era::Futuristic => 4.0,
        }
    }

    pub fn next(&self) -> Option<Era> {
        match self {
            Era::Primitive => Some(Era::Medieval),
            Era::Medieval => Some(Era::Industrial),
            Era::Industrial => Some(Era::Modern),
            Era::Modern => Some(Era::Futuristic),
            Era::Futuristic => None,
        }
    }
}
